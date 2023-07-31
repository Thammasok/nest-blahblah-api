import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  // Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Version('1')
  @Put('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  // @Version('1')
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
