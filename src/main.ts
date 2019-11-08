import { NestFactory } from '@nestjs/core'

import { AppModule } from 'app.module'
import applyGlobalConfig from 'apply-global-conf'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  applyGlobalConfig(app)
  await app.listen(3000)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap()
