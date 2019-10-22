import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'
import applyGlobalConfig from './apply-global-conf'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  applyGlobalConfig(app)
  await app.listen(3000)
}
bootstrap()
