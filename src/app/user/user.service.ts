import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/libs/prisma/prisma.service'
import { EditUserDto } from 'src/app/user/dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    })

    delete user.hash

    return user
  }
}
