import { IsInt, IsNotEmpty, Min, Max } from 'class-validator'

import { targetMaxRadius, targetMinRadius } from '../constants'

export default class CreateTargetDto {
  @IsNotEmpty()
  readonly title: string

  @IsInt()
  @Min(targetMinRadius)
  @Max(targetMaxRadius)
  readonly radius: number

  @IsNotEmpty()
  readonly latitude: number

  @IsNotEmpty()
  readonly longitude: number

  @IsNotEmpty()
  readonly topicId: number
}
