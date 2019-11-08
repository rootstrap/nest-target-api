import { HttpException, HttpStatus } from '@nestjs/common'

export class RecordNotFoundException extends HttpException {
  constructor(model) {
    super(`${model} not found.`, HttpStatus.NOT_FOUND)
  }
}
