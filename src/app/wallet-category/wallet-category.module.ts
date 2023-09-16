import { Module } from '@nestjs/common'
import { WalletCategoryService } from './wallet-category.service'
import { WalletCategoryController } from './wallet-category.controller'

@Module({
  providers: [WalletCategoryService],
  controllers: [WalletCategoryController],
})
export class WalletCategoryModule {}
