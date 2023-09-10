import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
  UuidStrategy,
} from './strategies'
import { MailService } from 'src/helpers/mail/mail.service'

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    UuidStrategy,
    MailService,
  ],
})
export class AuthModule {}
