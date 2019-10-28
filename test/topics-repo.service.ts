import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { lorem } from 'faker'

import { Topic } from '../src/topics/topic.entity'

export class TopicsRepoService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicsRepository: Repository<Topic>,
  ) {
  }

  async mockOne(): Promise<Topic> {
    let topic = new Topic(lorem.word())
    return this.topicsRepository.save(topic) 
  }

  async mockMany(count: number): Promise<Topic[]> {
    let topics = []
    for (let i = 0; i < count; i++) {
      topics.push(new Topic(`${lorem.word()}${i}`))
    }
    topics = await this.topicsRepository.save(topics)
    return topics
  }
}
