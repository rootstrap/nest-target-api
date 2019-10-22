
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { hash } from 'bcrypt'

import { ConfigService } from '../config/config.service'
import { User } from './user.entity'

export type User = any

@Injectable()
export class UsersService {
  private salts: number

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    config: ConfigService,
  ) {
    this.salts = config.bcryptSaltsNumber
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ email })
  }

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await hash(password, this.salts)
    const user = new User(email, hashedPassword)
    await this.usersRepository.save(user)
    return user
  }
}
