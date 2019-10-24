import { IsInt, IsNotEmpty, Min, Max } from 'class-validator'

import { targetMaxRadius, targetMinRadius } from '../constants'
import TopicDto from './topic.dto'
import UserDto from './user.dto'

export default class CreateTargetDto {
  constructor(target) {
    this.title = target.title
    this.radius = target.radius
    this.latitude = target.latitude
    this.longitude = target.longitude
    this.topic = target.topic
    this.user = target.user
  }
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
  readonly topic: TopicDto

  @IsNotEmpty()
  readonly user: UserDto
}
