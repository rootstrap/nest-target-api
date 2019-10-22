import { Injectable } from '@nestjs/common'
import { compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

import { User } from '../users/user.entity'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email)
    const passwordMatches = await compare(password, user.password)
    if (passwordMatches) {
      const { password: dontCare, ...rest } = user
      return rest
    }
    return null
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
