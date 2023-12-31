import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

import { MailService } from 'src/libs/mail/mail.service'

const configModule = new ConfigService()

@Module({
  imports: [
    MailerModule.forRoot({
      transport: configModule.get('MAIL_AUTH_SMTP'),
      defaults: {
        from: `"${configModule.get(
          'MAIL_DEFAULT_FROM_NAME',
        )}" <${configModule.get('MAIL_DEFAULT_FROM_EMAIL')}>`,
      },
      template: {
        dir: process.cwd() + '/src/libs/mail/templates/',
        adapter: new HandlebarsAdapter(undefined, {
          inlineCssEnabled: true,
          /** See https://www.npmjs.com/package/inline-css#api */
          inlineCssOptions: {
            url: process.cwd() + '/src/libs/mail/templates/css/style.css',
            preserveMediaQueries: true,
          },
        }),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
