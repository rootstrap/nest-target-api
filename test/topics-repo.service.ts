import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Topic } from '../src/topics/topic.entity'
import { ConfigService } from '../src/config/config.service'

export class TopicsRepoService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicsRepository: Repository<Topic>,
    config: ConfigService,
  ) {
  }

  async clear(): Promise<void> {
    await this.topicsRepository.clear()
  }

  async create(name: string): Promise<Topic> {
    const topic = new Topic(name)
    await this.topicsRepository.save(topic)
    return topic
  }

  async all(): Promise<Topic[]> {
    return this.topicsRepository.find()
  }
}
