import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { lorem, random, address } from 'faker'

import { TopicsRepoService } from './topics-repo.service'
import { Target } from '../src/targets/target.entity'
import { User } from '../src/users/user.entity'

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

  async mockMany(count: number, user: User): Promise<Target[]> {
    const topic = await this.topicsService.mockOne()
    const targets = []
    for (let i = 0; i < count; i++) {
      targets.push(new Target(
        `${lorem.word()}${i}`,
        random.number(),
        parseFloat(address.latitude()),
        parseFloat(address.longitude()),
        user,
        topic
      ))
    }
    return this.targetsRepository.save(targets)
  }
}
