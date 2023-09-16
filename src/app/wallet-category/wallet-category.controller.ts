import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { WalletCategoryService } from './wallet-category.service'
import { GetCurrentUserId } from 'src/common/decorators'

@Controller({ path: 'wallet-category', version: '1' })
export class WalletCategoryController {
  constructor(private walletCategoryService: WalletCategoryService) {}

  @Post('list')
  @HttpCode(HttpStatus.OK)
  async walletCategoriesList(@GetCurrentUserId() userId: number) {
    const user = await this.walletCategoryService.getWalletCategoriesLists(
      userId,
    )

    return user
  }
}
