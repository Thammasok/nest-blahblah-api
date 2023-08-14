import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UuidStrategy {
  constructor(private prisma: PrismaService) {}

  async getUUID() {
    const uuid = uuidv4()

    const account = await this.prisma.account.count({
      where: {
        uid: uuid,
      },
    })

    if (!account) {
      return uuid
    } else {
      this.getUUID()
    }
  }
}
