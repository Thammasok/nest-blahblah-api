import { Module } from '@nestjs/common'
import { AuthController } from 'src/app/auth/auth.controller'
import { AuthService } from 'src/app/auth/auth.service'
import { JwtModule } from '@nestjs/jwt'
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
  UuidStrategy,
} from 'src/app/auth/strategies'
import { MailService } from 'src/libs/mail/mail.service'

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
