import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { TopicDto } from '../dto'
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
  async getTopics(): Promise<TopicDto[]> {
    const topics = await this.topicsService.all()
    return TopicDto.fromArray(topics)
  }
}
