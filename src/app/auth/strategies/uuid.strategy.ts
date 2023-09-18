import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/libs/prisma/prisma.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UuidStrategy {
  constructor(private prisma: PrismaService) {}

  async getAccountUUID() {
    const accountUuid = uuidv4()

    const account = await this.prisma.account.count({
      where: {
        accountUuid,
      },
    })

    if (!account) {
      return accountUuid
    } else {
      this.getAccountUUID()
    }
  }
}
