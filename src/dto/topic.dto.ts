import { IsInt, IsNotEmpty } from 'class-validator'

export default class TopicDto {
  constructor(topic){
    this.id = topic.id
    this.name = topic.name
  }

  @IsInt()
  readonly id: number

  @IsNotEmpty()
  readonly name: string
}
