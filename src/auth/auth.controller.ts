import { Controller, Request, Body, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from 'auth/auth.service'
import { UsersService } from 'users/users.service'
import { CreateUserDto, UserDto } from 'dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() { user }) {
    return this.authService.login(user)
  }

  @Post('signup')
  async signup(@Body() { email, password: pass }: CreateUserDto) {
    const user = await this.usersService.create(email, pass)
    return UserDto.from(user)
  }
}
