import { Injectable } from '@nestjs/common'
import { compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

import { User } from 'users/user.entity'
import { UsersService } from 'users/users.service'
import { UserDto } from 'dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.usersService.findUserByEmail(email)
    if (user) {
      const passwordMatches = await compare(password, user.password)
      if (passwordMatches) {
        return user
      }
    }
    return null
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}
