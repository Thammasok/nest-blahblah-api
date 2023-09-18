import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { Account } from '@prisma/client'

import { AccessTokenGuard } from 'src/common/guards'
import { EditUserDto } from 'src/app/user/dto'
import { UserService } from 'src/app/user/user.service'
import { GetCurrentAccount, GetCurrentAccountId } from 'src/common/decorators'

@UseGuards(AccessTokenGuard)
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetCurrentAccount() account: Account) {
    return account
  }

  @Patch()
  editUser(@GetCurrentAccountId() accountId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(accountId, dto)
  }
}
