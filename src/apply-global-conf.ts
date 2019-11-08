import { ValidationPipe } from '@nestjs/common'
import { ErrorsInterceptor } from './interceptors/errors.interceptor'

export default app => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  app.useGlobalInterceptors(new ErrorsInterceptor())
}
