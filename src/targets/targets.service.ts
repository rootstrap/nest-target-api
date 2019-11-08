import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { getDistance } from 'geolib'

import { Target } from './target.entity'
import { Topic } from '../topics/topic.entity'
import { User } from '../users/user.entity'
import { UserDto } from '../dto'
import { MAX_TARGETS, WEEK } from './target.constants'

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

  async canCreateTargets(userInfo: UserDto): Promise<boolean> {
    const user = await this.usersRepository.findOne(userInfo, {
      relations: ['targets'],
    })
    return !user.targets || user.targets.length < MAX_TARGETS
  }

  async create(
    title: string,
    radius: number,
    latitude: string,
    longitude: string,
    userInfo: User,
    topicID: number,
  ): Promise<{ target: Target; matches: Target[] }> {
    const topic = await this.topicsRepository.findOne(topicID)
    const user = await this.usersRepository.findOne(userInfo)

    const sameTopicTargets = await this.targetsRepository.find({ topic })

    const matches = sameTopicTargets.filter(target => {
      const distance = getDistance(
        { latitude: target.latitude, longitude: target.longitude },
        { latitude, longitude },
      )
      return distance < target.radius + radius
    })

    let target = new Target(
      title,
      radius,
      latitude,
      longitude,
      user,
      topic,
      matches,
    )

    matches.forEach(match => {
      if (!match.matches) match.matches = []
      match.matches.push(target)
    })

    // eslint-disable-next-line require-atomic-updates
    target = await this.targetsRepository.save(target)

    return {
      target,
      matches,
    }
  }

  async cleanOldTargets() {
    const oldTargets = await this.targetsRepository.find()
    const now = Date.now()

    oldTargets.filter(target => {
      const createdAt = new Date(target.createdAt).getTime()
      const targetAge = now - createdAt
      return targetAge > WEEK
    })

    await this.targetsRepository.remove(oldTargets)
  }

  async findByUser(userInfo): Promise<Target[]> {
    const user = await this.usersRepository.findOne(userInfo, {
      relations: ['targets', 'targets.topic'],
    })
    return user.targets
  }

  async deleteByUser(user, id): Promise<Target[]> {
    const { targets } = await this.usersRepository.findOne(user, {
      relations: ['targets'],
    })
    const target = targets && targets.filter(target => target.id === id)
    if (target && target.length) {
      return this.targetsRepository.remove(target)
    }
  }
}
