import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { GetCurrentUserId } from 'src/common/decorators'

@Controller({ path: 'wallet', version: '1' })
export class WalletController {
  @Post('list')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@GetCurrentUserId() userId: string) {
    console.log('ssss', userId)
  }
}
