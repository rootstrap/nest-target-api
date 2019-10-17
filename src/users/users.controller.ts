import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(AuthGuard())
  @Get()
  getProfile(@Request() { user }) {
    return user;
  }
}
