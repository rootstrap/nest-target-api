import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '../auth/auth.service'
import { TopicsService } from './topics.service'

@Controller('topics')
export class TopicsController {
  constructor(
    private readonly authService: AuthService,
    private readonly topicsService: TopicsService,
  ) { }

  @UseGuards(AuthGuard())
  @Get()
  getTopics() {
    return this.topicsService.all()
  }
}
