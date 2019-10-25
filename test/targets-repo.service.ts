import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Target } from '../src/targets/target.entity'

export class TargetsRepoService {
  private salts: number

  constructor(
    @InjectRepository(Target)
    private readonly targetsRepository: Repository<Target>,
  ) {}

  async last(): Promise<Target> {
    return this.targetsRepository.findOne({ relations: ['user', 'topic'] })
  }
}
