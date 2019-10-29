import { IsInt, IsNotEmpty, Min, Max } from 'class-validator'
import { Expose } from 'class-transformer'

import { TopicDto } from './'
import { Target } from '../targets/target.entity'
import { TARGET_MAX_RADIUS, TARGET_MIN_RADIUS } from '../constants'

export default class TargetDto {
  @IsNotEmpty()
  @Expose()
  readonly id: number

  @IsNotEmpty()
  @Expose()
  readonly title: string

  @IsInt()
  @Min(TARGET_MIN_RADIUS)
  @Max(TARGET_MAX_RADIUS)
  @Expose()
  readonly radius: number

  @IsNotEmpty()
  @Expose()
  readonly latitude: number

  @IsNotEmpty()
  @Expose()
  readonly longitude: number

  @IsNotEmpty()
  @Expose()
  readonly topic: TopicDto

  static from(target: Target): TargetDto {
    return {
      id: target.id,
      title: target.title,
      radius: target.radius,
      latitude: target.latitude,
      longitude: target.longitude,
      topic: target.topic,
    }
  }

  static fromArray(targets: Target[]): TargetDto[] {
    return targets.map(this.from)
  }
}
