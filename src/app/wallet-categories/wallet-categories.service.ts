import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/libs/prisma/prisma.service'

@Injectable()
export class WalletCategoriesService {
  constructor(private prisma: PrismaService) {}

  async getWalletCategoriesLists(accountId: number) {
    // const categoriesLists = await this.prisma.walletCategories.findMany({
    //   where: {
    //     accountId,
    //   },
    // })
    // return categoriesLists
  }
}