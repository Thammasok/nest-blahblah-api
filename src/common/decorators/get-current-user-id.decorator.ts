import { JwtPayload } from '../../app/auth/types'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetCurrentUserId = createParamDecorator(
  (_data: undefined, context: ExecutionContext): number => {
    const req = context.switchToHttp().getRequest()
    const user = req.user as JwtPayload
    return user.userId
    // jwt guard passes and information is contained in req.user
  },
)
