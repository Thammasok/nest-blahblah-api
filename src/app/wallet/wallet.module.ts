import { Module } from '@nestjs/common'
import { WalletController } from 'src/app/wallet/wallet.controller'
import { WalletService } from 'src/app/wallet/wallet.service'

@Module({
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
