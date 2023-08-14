import * as bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import {
  AuthResendVerifyDto,
  AuthSignInDto,
  AuthSignUpDto,
  AuthVerifyMailDto,
} from './dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { v4 as uuidv4 } from 'uuid'
import { UuidStrategy } from './strategy'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private uuid: UuidStrategy,
  ) {}

  async signup(dto: AuthSignUpDto) {
    const uuid = await this.uuid.getUUID()
    const verify = await this.getVerifyCode()

    try {
      const initData = {
        uid: uuid,
        language: 'en-EN',
        date_format: 'dd-mm-yyyy',
        time_zone: '+07:00',
        ...verify,
      }

      // generate the password hash
      const saltRound = 8
      const pwdHash = await bcrypt.hash(dto.password, saltRound)

      // save the new user in the db
      const account = await this.prisma.account.create({
        data: {
          display_name: dto.display_name,
          email: dto.email,
          password: pwdHash,
          ...initData,
        },
      })

      return this.signToken(account.uid)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          if (error.meta.target === 'accounts_email_key') {
            throw new ForbiddenException('email is already')
          }

          throw new ForbiddenException(error.meta)
        }
      }

      throw error
    }
  }

  async signin(dto: AuthSignInDto) {
    // find the user by email
    const account = await this.prisma.account.findUnique({
      where: {
        email: dto.email,
      },
    })
    // if user does not exist throw exception
    if (!account) throw new ForbiddenException('email or password incorrect')

    // compare password
    const pwdMatches = await bcrypt.compare(dto.password, account.password)

    // if password incorrect throw exception
    if (!pwdMatches)
      throw new ForbiddenException('email or password incorrect 1')

    return this.signToken(account.uid)
  }

  async signToken(uid: string): Promise<{ access_token: string }> {
    const payload = {
      sub: uid,
    }
    const secret = this.config.get('JWT_SECRET')

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '5m',
      secret: secret,
    })

    return {
      access_token: token,
    }
  }

  async resendVerifyMail(dto: AuthResendVerifyDto) {
    const verify = await this.getVerifyCode()
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
        throw new ForbiddenException(
          'cannot send verify to your email, plase try again',
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
      throw new ForbiddenException('email, token or date expired is incorrect')

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
        throw new ForbiddenException('cannot verify email, plase try again')

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
