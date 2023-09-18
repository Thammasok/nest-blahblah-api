import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'

import { AppModule } from 'src/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  app.enableVersioning({
    type: VersioningType.URI,
    // defaultVersion: ['v1', 'v2'],
  })

  const logger = new Logger()
  const configService = app.get(ConfigService)
  const port = configService.get('SERVER_PORT') || 3000
  await app.listen(port)
  logger.verbose(`listening on port ${port}`)
}

bootstrap()
