import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { WalletCategoriesService } from 'src/app/wallet-categories/wallet-categories.service'
import { GetCurrentAccountId } from 'src/common/decorators'

@Controller({ path: 'wallet-category', version: '1' })
export class WalletCategoriesController {
  constructor(private walletCategoriesService: WalletCategoriesService) {}

  @Post('list')
  @HttpCode(HttpStatus.OK)
  async walletCategoriesList(@GetCurrentAccountId() accountId: number) {
    const walletCategoryLists =
      await this.walletCategoriesService.getWalletCategoriesLists(accountId)

    return walletCategoryLists
  }
}
