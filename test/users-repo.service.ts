import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from '../src/users/user.entity'
import { hash } from 'bcrypt'
import { ConfigService } from '../src/config/config.service'

export class UsersRepoService {
  private salts: number

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    config: ConfigService,
  ) {
    this.salts = config.bcryptSaltsNumber
  }

  async clear() {
    await this.usersRepository.clear()
  }

  async getLastUser() {
    return this.usersRepository.findOne()
  }

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await hash(password, this.salts)
    const user = new User(email, hashedPassword)
    await this.usersRepository.save(user)
    return user
  }
}
