import { Module } from '@nestjs/common'
import { UserController } from 'src/app/user/user.controller'
import { UserService } from 'src/app/user/user.service'

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
