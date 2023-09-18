import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayloadWithRt } from 'src/app/auth/types'

export const GetCurrentAccount = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest()
    if (!data) return req.user

    return req.user[data]
  },
)
