import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  // Version,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  AuthResendVerifyDto,
  AuthSignInDto,
  AuthSignUpDto,
  AuthVerifyMailDto,
} from './dto'

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Version('1')
  @Put('signup')
  signup(@Body() dto: AuthSignUpDto) {
    return this.authService.signup(dto)
  }

  // @Version('1')
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthSignInDto) {
    return this.authService.signin(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-verify')
  resendVerifyMail(@Body() dto: AuthResendVerifyDto) {
    return this.authService.resendVerifyMail(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('email-verify')
  verifyMail(@Body() dto: AuthVerifyMailDto) {
    return this.authService.verifyMail(dto)
  }
}
