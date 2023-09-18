import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { GetCurrentAccountId } from 'src/common/decorators'

@Controller({ path: 'wallet', version: '1' })
export class WalletController {
  @Post('list')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@GetCurrentAccountId() accountId: string) {
    console.log('ssss', accountId)
  }
}
