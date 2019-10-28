import { IsInt, IsNotEmpty, Min, Max } from 'class-validator'

import { Topic } from '../topics/topic.entity'
import { TARGET_MAX_RADIUS, TARGET_MIN_RADIUS } from '../constants'

export default class TargetIndexDto {
  constructor(target) {
    this.title = target.title
    this.radius = target.radius
    this.latitude = target.latitude
    this.longitude = target.longitude
    this.topic = target.topic
  }
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
  readonly topic: Topic
}
