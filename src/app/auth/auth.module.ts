import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy, UuidStrategy } from './strategy'
import { MailService } from '../../helpers/mail/mail.service'

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UuidStrategy, MailService],
})
export class AuthModule {}
