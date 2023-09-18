import { Module, ValidationPipe } from '@nestjs/common'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'

import { AccessTokenGuard } from './common/guards'
import { AuthModule } from './app/auth/auth.module'
import { UserModule } from './app/user/user.module'
import { BookmarkModule } from './app/bookmark/bookmark.module'
import { PrismaModule } from './libs/prisma/prisma.module'
import { MailModule } from './libs/mail/mail.module'
import { RateLimitModule } from './libs/rate-limit/rate-limit.module'
import { LocalizeModule } from './libs/localize/localize.module'

// import { WalletModule } from 'src/app/wallet/wallet.module'
import { WalletCategoriesModule } from 'src/app/wallet-categories/wallet-categories.module'

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
    // WalletModule,
    WalletCategoriesModule,
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
