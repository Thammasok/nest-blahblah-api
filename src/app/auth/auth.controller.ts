import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import {
  AuthResendVerifyDto,
  AuthSignInDto,
  AuthSignUpDto,
  AuthVerifyMailDto,
} from 'src/app/auth/dto'
import { RefreshTokenGuard } from 'src/common/guards'
import {
  GetCurrentAccountId,
  GetCurrentAccount,
  Public,
} from 'src/common/decorators'
import { AuthService } from 'src/app/auth/auth.service'

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() dto: AuthSignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signin(dto)

    // set cookie
    res.cookie('refresh_token', user.tokens.refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
      httpOnly: true,
    })

    return user
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signupLocal(@Body() dto: AuthSignUpDto) {
    const user = await this.authService.signup(dto)
    return user
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentAccountId() accountId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(accountId)
    res.clearCookie('refresh_token')
    return { msg: 'logout is success' }
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentAccountId() accountId: number,
    @GetCurrentAccount('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.refreshTokens(accountId, refreshToken)
    res.cookie('refresh_token', refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
      httpOnly: true,
    })
    return { access_token, refresh_token }
  }

  @Public()
  @Post('resend-verify')
  @HttpCode(HttpStatus.OK)
  resendVerifyMail(@Body() dto: AuthResendVerifyDto) {
    return this.authService.sendVerifyMail(dto)
  }

  @Public()
  @Patch('email-verify')
  @HttpCode(HttpStatus.OK)
  verifyMail(@Body() dto: AuthVerifyMailDto) {
    return this.authService.verifyMail(dto)
  }
}
