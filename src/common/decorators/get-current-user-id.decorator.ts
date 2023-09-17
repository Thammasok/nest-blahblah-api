import { JwtPayload } from '../../app/auth/types'
import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { PrismaService } from '../../helpers/prisma/prisma.service'
import { ConfigService } from '@nestjs/config'

export const GetCurrentAccountId = createParamDecorator(
  async (_data: undefined, context: ExecutionContext): Promise<number> => {
    const req = context.switchToHttp().getRequest()
    const user = req.user as JwtPayload

    const configService = new ConfigService()
    const prismaService = new PrismaService(configService)

    try {
      const account = await prismaService.account.findFirst({
        where: {
          accountUuid: user.accountId,
        },
      })

      if (!account)
        throw new HttpException('account unauthorized', HttpStatus.UNAUTHORIZED)

      return account.id

      // jwt guard passes and information is contained in req.user
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  },
)
