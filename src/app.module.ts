import { Module, ValidationPipe } from '@nestjs/common'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'

import { AccessTokenGuard } from './common/guards'
import { AuthModule } from './app/auth/auth.module'
import { UserModule } from './app/user/user.module'
import { BookmarkModule } from './app/bookmark/bookmark.module'
import { PrismaModule } from './helpers/prisma/prisma.module'
import { MailModule } from './helpers/mail/mail.module'
import { RateLimitModule } from './helpers/rate-limit/rate-limit.module'
import { LocalizeModule } from './helpers/localize/localize.module'
import { WalletModule } from './app/wallet/wallet.module'
import { WalletCategoryModule } from './app/wallet-category/wallet-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [process.env.NODE_ENV ? 'dev' : '.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      load: [configuration],
    }),
    MailModule,
    RateLimitModule,
    LocalizeModule,
    PrismaModule,
    AuthModule,
    UserModule,
    BookmarkModule,

    // Memoney
    WalletModule,

    WalletCategoryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
