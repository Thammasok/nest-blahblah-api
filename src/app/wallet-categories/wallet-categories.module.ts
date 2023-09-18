import { Module } from '@nestjs/common'
import { WalletCategoriesService } from 'src/app/wallet-categories/wallet-categories.service'
import { WalletCategoriesController } from 'src/app/wallet-categories/wallet-categories.controller'

@Module({
  providers: [WalletCategoriesService],
  controllers: [WalletCategoriesController],
})
export class WalletCategoriesModule {}
