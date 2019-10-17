import { Controller, Request, Body, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() { user }) {
    return await this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() { email, password: pass }) {
    try {
      const { password, ...rest } = await this.usersService.create(email, pass);
      return rest;
    } catch (error) {
      return error
    }
  }
}
