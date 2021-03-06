import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { lorem, random, address } from 'faker'

import { Target } from 'targets/target.entity'
import { User } from 'users/user.entity'
import { TopicsRepoService } from './topics-repo.service'

export class TargetsRepoService {
  private salts: number

  constructor(
    @InjectRepository(Target)
    private readonly targetsRepository: Repository<Target>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly topicsService: TopicsRepoService,
  ) {}

  async last(): Promise<Target> {
    return this.targetsRepository.findOne({ relations: ['user', 'topic'] })
  }

  async mockOneFromInfo(target, user, topic): Promise<Target> {
    const newTarget = new Target(
      target.title,
      target.radius,
      target.latitude,
      target.longitude,
      user,
      topic,
    )
    return this.targetsRepository.save(newTarget)
  }

  async mockOne(user: User): Promise<Target> {
    const topic = await this.topicsService.mockOne()
    const target = new Target(
      lorem.word(),
      random.number(),
      address.latitude(),
      address.longitude(),
      user,
      topic,
    )
    return this.targetsRepository.save(target)
  }

  async findById(id: number): Promise<Target> {
    return this.targetsRepository.findOne(id)
  }

  async mockMany(count: number, user: User): Promise<Target[]> {
    const topic = await this.topicsService.mockOne()
    const targets = []
    for (let i = 0; i < count; i++) {
      targets.push(
        new Target(
          `${lorem.word()}${i}`,
          random.number(),
          address.latitude(),
          address.longitude(),
          user,
          topic,
        ),
      )
    }
    return this.targetsRepository.save(targets)
  }
}
