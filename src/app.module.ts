import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './app/auth/auth.module'
import { UserModule } from './app/user/user.module'
import { BookmarkModule } from './app/bookmark/bookmark.module'
import { PrismaModule } from './prisma/prisma.module'
import { MailModule } from './app/mail/mail.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    BookmarkModule,
    MailModule,
  ],
})
export class AppModule {}
