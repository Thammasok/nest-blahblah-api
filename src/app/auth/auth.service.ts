import * as bcrypt from 'bcrypt'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { AuthSignInDto, AuthSignUpDto } from './dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
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

    try {
      const initData = {
        uid: uuid,
        language: 'en-EN',
        date_format: 'dd-mm-yyyy',
        time_zone: '+0700',
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
}
