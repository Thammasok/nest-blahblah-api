import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { WalletCategoryService } from './wallet-category.service'
import { GetCurrentAccountId } from 'src/common/decorators'

@Controller({ path: 'wallet-category', version: '1' })
export class WalletCategoryController {
  constructor(private walletCategoryService: WalletCategoryService) {}

  @Post('list')
  @HttpCode(HttpStatus.OK)
  async walletCategoriesList(@GetCurrentAccountId() accountId: number) {
    const walletCategoryLists =
      await this.walletCategoryService.getWalletCategoriesLists(accountId)

    return walletCategoryLists
  }
}
