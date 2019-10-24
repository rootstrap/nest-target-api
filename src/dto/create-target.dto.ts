import { IsInt, IsNotEmpty, Min, Max } from 'class-validator'

import { TARGET_MAX_RADIUS, TARGET_MIN_RADIUS } from '../constants'

export default class CreateTargetDto {
  @IsNotEmpty()
  readonly title: string

  @IsInt()
  @Min(TARGET_MIN_RADIUS)
  @Max(TARGET_MAX_RADIUS)
  readonly radius: number

  @IsNotEmpty()
  readonly latitude: number

  @IsNotEmpty()
  readonly longitude: number

  @IsNotEmpty()
  readonly topicId: number
}
