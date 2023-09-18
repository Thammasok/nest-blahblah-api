import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import { JwtService } from '@nestjs/jwt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import {
  AuthResendVerifyDto,
  AuthSignInDto,
  AuthSignUpDto,
  AuthVerifyMailDto,
} from 'src/app/auth/dto'
import { Tokens } from 'src/app/auth/types/tokens.type'
import { UuidStrategy } from 'src/app/auth/strategies'
import { PrismaService } from 'src/libs/prisma/prisma.service'
import { MailService } from 'src/libs/mail/mail.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private uuid: UuidStrategy,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signin(dto: AuthSignInDto) {
    // find the user by email
    const account = await this.prisma.account.findUnique({
      where: {
        email: dto.email,
      },
    })

    // if user does not exist throw exception
    if (!account)
      throw new HttpException(
        'email or password incorrect',
        HttpStatus.NOT_FOUND,
      )

    // compare password
    const passwordMatches = await bcrypt.compare(dto.password, account.password)
    if (!passwordMatches)
      throw new HttpException(
        'email or password incorrect',
        HttpStatus.NOT_FOUND,
      )

    const tokens = await this.getTokens(account.accountUuid)
    const settings = await this.getAccountSettting(account.id)
    await this.updateRefreshTokenHash(account.id, tokens.refresh_token)

    return {
      tokens,
      account: {
        accountName: account.accountName,
        displayName: account.displayName,
        email: account.email,
        isVerify: account.isVerify,
      },
      settings,
    }
  }

  async signup(dto: AuthSignUpDto) {
    const uuid = await this.uuid.getAccountUUID()
    const passwordHash = await this.hashData(dto.password)

    try {
      // save the new account in the db
      const account = await this.prisma.account.create({
        data: {
          accountUuid: uuid,
          displayName: dto.display_name,
          email: dto.email,
          password: passwordHash,
        },
      })

      await this.sendVerifyMail({ email: dto.email })
      const settings = await this.updateAccountSetting(account.id, null)
      const tokens = await this.getTokens(account.accountUuid)
      await this.updateRefreshTokenHash(account.id, tokens.refresh_token)

      return {
        tokens,
        account: {
          accountName: account.accountName,
          displayName: account.displayName,
          email: account.email,
          isVerify: account.isVerify,
        },
        settings,
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          if (error.meta.target[0] === 'email') {
            throw new HttpException('email is already', HttpStatus.CONFLICT)
            // throw new HttpException(
            //   this.i18n.t('auth.email-is-already', {
            //     lang: I18nContext.current().lang,
            //   }),
            //   409,
            // )
          }

          // throw new ForbiddenException(error.meta)
          throw new HttpException(error.meta, 403)
        }
      }

      throw error
    }
  }

  async logout(accountId: number) {
    await this.prisma.accountToken.delete({
      where: {
        accountId,
      },
    })
  }

  async getAccountByAccountUuid(accountUuid: string) {
    const account = await this.prisma.account.findFirst({
      where: {
        accountUuid,
        isRemove: false,
      },
    })

    if (!account)
      throw new HttpException('account not found', HttpStatus.NOT_FOUND)

    return account
  }

  async getAccountSettting(accountId: number) {
    const accountSetting = await this.prisma.accountSetting.findFirst({
      where: {
        accountId,
      },
    })

    if (!accountSetting) return {}

    delete accountSetting.accountId

    return accountSetting
  }

  async updateAccountSetting(accountId: number, setting: object | null) {
    const dataSetting = setting || {
      language: 'en-EN',
      dateFormat: 'dd-mm-yyyy',
      timeZone: '+07:00',
    }

    const accountSetting = await this.prisma.accountSetting.upsert({
      where: {
        accountId,
      },
      update: dataSetting,
      create: {
        accountId,
        language: 'en-EN',
        dateFormat: 'dd-mm-yyyy',
        timeZone: '+07:00',
      },
    })

    if (!accountSetting) return {}

    delete accountSetting.accountId

    return accountSetting
  }

  async getTokens(accountUuid: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          accountId: accountUuid,
          sub: 'access_token',
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          accountId: accountUuid,
          sub: 'refresh_token',
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      ),
    ])
    return { access_token, refresh_token }
  }

  async refreshTokens(
    accountId: number,
    refreshToken: string,
  ): Promise<Tokens> {
    const account = await this.prisma.account.findUnique({
      where: {
        id: accountId,
      },
    })
    const accountToken = await this.prisma.accountToken.findUnique({
      where: {
        accountId,
      },
    })

    if (!accountToken || !accountToken.refreshToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)

    const refreshTokenFromDb = await this.jwtService.verify(
      accountToken.refreshToken,
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      },
    )

    const refreshTokenFromReq = await this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    })

    if (refreshTokenFromDb.accountId !== refreshTokenFromReq.accountId)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)

    const tokens = await this.getTokens(account.accountUuid)
    await this.updateRefreshTokenHash(
      accountToken.accountId,
      tokens.refresh_token,
    )

    return tokens
  }

  hashData(data: string) {
    // const saltRound = 10
    return bcrypt.hash(data, 10)
  }

  async updateRefreshTokenHash(accountId: number, refreshToken: string) {
    await this.prisma.accountToken.upsert({
      where: {
        accountId,
      },
      create: {
        accountId,
        refreshToken,
      },
      update: {
        refreshToken,
      },
    })
  }

  async sendVerifyMail(dto: AuthResendVerifyDto) {
    const account = await this.prisma.account.findUnique({
      where: {
        email: dto.email,
        isVerify: false,
      },
    })

    if (account) {
      const verify = await this.getVerifyCode()

      this.mailService.sendMail({
        to: dto.email,
        from: `"${this.configService.get<string>(
          'MAIL_DEFAULT_FROM_NANE',
        )}" <${this.configService.get<string>('MAIL_DEFAULT_FROM_EMAIL')}>`,
        subject: 'Please verify e-mail address for example.com',
        template: 'auth/email-verify',
        context: {
          email: dto.email,
          verifyUrl: this.configService.get<string>('MAIL_VERIFY_URL'),
          verifyToken: verify.verifyExpired,
        },
      })

      await this.prisma.accountVerify.upsert({
        where: {
          accountId: account.id,
        },
        create: {
          accountId: account.id,
          token: verify.verifyToken,
          expiredAt: verify.verifyExpired,
        },
        update: {
          token: verify.verifyToken,
          expiredAt: verify.verifyExpired,
        },
      })

      // if (!accountVerify)
      //   throw new HttpException(
      //     'cannot send verify to your email, plase try again',
      //     HttpStatus.FORBIDDEN,
      //   )

      return {
        msg: 'send verify to your email completed',
      }
    } else {
      // cannot send verify to your email, plase try again
      throw new HttpException(
        'email not found or may be verified',
        HttpStatus.FORBIDDEN,
      )
    }
  }

  async verifyMail(dto: AuthVerifyMailDto) {
    const now = dayjs().format()

    const accountInfo = await this.prisma.account.findUnique({
      where: {
        email: dto.email,
        isVerify: false,
      },
    })

    if (accountInfo) {
      const checkVerify = await this.prisma.accountVerify.count({
        where: {
          accountId: accountInfo.id,
          token: dto.token,
          expiredAt: {
            gte: now,
          },
        },
      })

      if (checkVerify === 0)
        throw new HttpException(
          'token, email or date expired is incorrect',
          HttpStatus.FORBIDDEN,
        )

      await Promise.all([
        // Update Verify at
        this.prisma.account.update({
          where: {
            id: accountInfo.id,
          },
          data: {
            isVerify: true,
          },
        }),
        // Update Verify
        this.prisma.accountVerify.update({
          where: {
            accountId: accountInfo.id,
          },
          data: {
            verifyAt: dayjs().format(),
          },
        }),
      ])

      return {
        msg: 'verify your email completed',
      }
    } else {
      throw new HttpException(
        'token is incorrect or expired',
        HttpStatus.FORBIDDEN,
      )
    }
  }

  async getVerifyCode() {
    const token = uuidv4()

    //dayjs().format()// => current date in ISO8601, without fraction seconds e.g. '2020-04-02T08:02:17-05:00'
    const expiredAt = dayjs().add(1, 'day').format()

    return {
      verifyToken: token,
      verifyExpired: expiredAt,
    }
  }
}
