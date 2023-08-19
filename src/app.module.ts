import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

import { AuthModule } from './app/auth/auth.module'
import { UserModule } from './app/user/user.module'
import { BookmarkModule } from './app/bookmark/bookmark.module'
import { PrismaModule } from './prisma/prisma.module'
import { MailModule } from './app/mail/mail.module'

const configModule = new ConfigService()

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: configModule.get('MAILGUN_AUTH_SMTP'),
      defaults: {
        from: `"${configModule.get(
          'MAILGUN_DEFAULT_FROM_NAME',
        )}" <${configModule.get('MAILGUN_DEFAULT_FROM_EMAIL')}>`,
      },
      template: {
        dir: process.cwd() + '/src/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    BookmarkModule,
    MailModule,
  ],
})
export class AppModule {}
