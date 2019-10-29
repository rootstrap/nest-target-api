import { IsInt, IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'

import { Topic } from '../topics/topic.entity'

export default class TopicDto {
  @IsInt()
  @Expose()
  readonly id: number

  @IsNotEmpty()
  @Expose()
  readonly name: string

  static from(topic: Topic): TopicDto {
    return {
      id: topic.id,
      name: topic.name,
    }
  }

  static fromArray(topics: Topic[]): TopicDto[] {
    return topics.map(this.from)
  }
}
