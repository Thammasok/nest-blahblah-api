import { Module, ValidationPipe } from '@nestjs/common'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import configuration from 'src/config/configuration'

import { AccessTokenGuard } from 'src/common/guards'
import { AuthModule } from 'src/app/auth/auth.module'
import { UserModule } from 'src/app/user/user.module'
import { BookmarkModule } from 'src/app/bookmark/bookmark.module'
import { PrismaModule } from 'src/libs/prisma/prisma.module'
import { MailModule } from 'src/libs/mail/mail.module'
import { RateLimitModule } from 'src/libs/rate-limit/rate-limit.module'
import { LocalizeModule } from 'src/libs/localize/localize.module'
// import { WalletModule } from 'src/app/wallet/wallet.module'
// import { WalletCategoryModule } from 'src/app/wallet-category/wallet-category.module';

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
    // WalletCategoryModule,
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
