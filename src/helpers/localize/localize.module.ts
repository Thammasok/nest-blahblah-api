import { Module } from '@nestjs/common'
// import * as path from 'path'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'

/**
 * https://nestjs-i18n.com/
 */

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        en: 'en',
        th: 'th',
      },
      loaderOptions: {
        // path: path.join(__dirname, 'lang'),
        path: process.cwd() + '/src/helpers/localize/lang',
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['Accept-Language'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
})
export class LocalizeModule {}
