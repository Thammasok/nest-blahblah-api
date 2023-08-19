import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './app/auth/auth.module'
import { UserModule } from './app/user/user.module'
import { BookmarkModule } from './app/bookmark/bookmark.module'
import { PrismaModule } from './prisma/prisma.module'
import { MailModule } from './helpers/mail/mail.module'
import { RateLimitModule } from './helpers/rate-limit/rate-limit.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    RateLimitModule,
    PrismaModule,
    AuthModule,
    UserModule,
    BookmarkModule,
  ],
})
export class AppModule {}
