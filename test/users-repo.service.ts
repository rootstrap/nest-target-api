import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../src/users/user.entity'

export class UsersRepoService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async clear() {
    await this.usersRepository.clear()
  }

  async getLastUser() {
    return this.usersRepository.findOne()
  }
}
