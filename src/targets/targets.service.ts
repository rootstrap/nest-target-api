import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Target } from './target.entity'
import { Topic } from '../topics/topic.entity'
import { User } from '../users/user.entity'
import { TargetDto } from '../dto'

@Injectable()
export class TargetsService {
  constructor(
    @InjectRepository(Target)
    private readonly targetsRepository: Repository<Target>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Topic)
    private readonly topicsRepository: Repository<Topic>,
  ) {}

  async create(
    title: string,
    radius: number,
    latitude: number,
    longitude: number,
    userInfo: User,
    topicID: number,
  ) {
    const topic = await this.topicsRepository.findOne(topicID)
    const user = await this.usersRepository.findOne(userInfo)

    const target = new Target(title, radius, latitude, longitude, user, topic)
    return new TargetDto(await this.targetsRepository.save(target))
  }
}
