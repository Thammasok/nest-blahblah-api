import { HttpException, Injectable } from '@nestjs/common'
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
} from '../auth/dto'
import { Tokens } from './types/tokens.type'
import { UuidStrategy } from './strategies'
import { PrismaService } from '../../helpers/prisma/prisma.service'
import { MailService } from '../../helpers/mail/mail.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private uuid: UuidStrategy,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signinLocal(dto: AuthSignInDto) {
    // find the user by email
    const account = await this.prisma.account.findUnique({
      where: {
        email: dto.email,
      },
    })

    // if user does not exist throw exception
    if (!account) throw new HttpException('email or password incorrect', 404)

    // compare password
    const passwordMatches = await bcrypt.compare(dto.password, account.password)
    if (!passwordMatches)
      throw new HttpException('email or password incorrect', 404)

    const tokens = await this.getTokens(account.uid, account.email)
    await this.updateRefreshTokenHash(account.uid, tokens.refresh_token)
    return {
      token: {
        ...tokens,
      },
      user: {
        display_name: account.display_name,
        email: account.email,
        language: account.language,
        date_format: account.date_format,
        time_zone: account.time_zone,
      },
    }
  }

  async signupLocal(dto: AuthSignUpDto) {
    const uuid = await this.uuid.getUUID()
    const verify = await this.getVerifyCode()

    const passwordHash = await this.hashData(dto.password)

    try {
      const initData = {
        uid: uuid,
        language: 'en-EN',
        date_format: 'dd-mm-yyyy',
        time_zone: '+07:00',
        ...verify,
      }

      // save the new user in the db
      const account = await this.prisma.account.create({
        data: {
          display_name: dto.display_name,
          email: dto.email,
          password: passwordHash,
          ...initData,
        },
      })

      const tokens = await this.getTokens(account.uid, account.email)
      await this.updateRefreshTokenHash(account.uid, tokens.refresh_token)

      return {
        token: {
          ...tokens,
        },
        user: {
          display_name: account.display_name,
          email: account.email,
          language: account.language,
          date_format: account.date_format,
          time_zone: account.time_zone,
        },
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          if (error.meta.target[0] === 'email') {
            throw new HttpException('email is already', 409)
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

  async logout(userId: string) {
    await this.prisma.account.update({
      where: {
        uid: userId,
      },
      data: {
        hashedRt: null,
      },
    })
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.prisma.account.findUnique({
      where: {
        uid: userId,
      },
    })

    if (!user || !user.hashedRt) throw new HttpException('token not found', 404)
    const rtmatches = await bcrypt.compare(refreshToken, user.hashedRt)

    if (!rtmatches) throw new HttpException('token not found', 404)
    const tokens = await this.getTokens(user.uid, user.email)
    await this.updateRefreshTokenHash(user.uid, tokens.refresh_token)

    return tokens
  }

  hashData(data: string) {
    // const saltRound = 10
    return bcrypt.hash(data, 10)
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          email,
          sub: 'access_token',
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
          email,
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

  async updateRefreshTokenHash(userId: string, rt: string) {
    const hash = await this.hashData(rt)
    await this.prisma.account.update({
      where: {
        uid: userId,
      },
      data: {
        hashedRt: hash,
      },
    })
  }

  async resendVerifyMail(dto: AuthResendVerifyDto) {
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
        verify_url: this.configService.get<string>('MAIL_VERIFY_URL'),
        verify_token: verify.verify_token,
      },
    })

    const account = await this.prisma.account.update({
      where: {
        email: dto.email,
      },
      data: {
        ...verify,
      },
    })

    if (!account)
      if (!account)
        throw new HttpException(
          'cannot send verify to your email, plase try again',
          403,
        )

    return {
      msg: 'send verify to your email completed',
    }
  }

  async verifyMail(dto: AuthVerifyMailDto) {
    const now = dayjs().format()

    const checkVerify = await this.prisma.account.count({
      where: {
        email: dto.email,
        verify_token: dto.token,
        verify_expired: {
          gte: now,
        },
      },
    })

    if (checkVerify === 0)
      throw new HttpException('email, token or date expired is incorrect', 403)

    const account = await this.prisma.account.update({
      where: {
        email: dto.email,
      },
      data: {
        verify_token: null,
        verify_expired: null,
        is_verify: true,
      },
    })

    if (!account)
      if (!account)
        throw new HttpException('cannot verify email, plase try again', 403)

    return {
      msg: 'verify your email completed',
    }
  }

  async getVerifyCode(): Promise<{
    verify_token: string
    verify_expired: string
  }> {
    const token = uuidv4()

    //dayjs().format()// => current date in ISO8601, without fraction seconds e.g. '2020-04-02T08:02:17-05:00'
    const now = dayjs().add(1, 'day').format()

    return {
      verify_token: token,
      verify_expired: now,
    }
  }
}
