import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { TargetsService } from './targets.service'
import CreateTargetDto from '../dto/create-target.dto'

@Controller('targets')
export class TargetsController {
  constructor(
    private readonly targetservice: TargetsService,
  ) { }

  @UseGuards(AuthGuard())
  @Post()
  async create(
    @Request() { user },
    @Body() { title, radius, latitude, longitude, topicId }: CreateTargetDto,
  ) {
    const target = await this.targetservice.create(
      title,
      radius,
      latitude,
      longitude,
      user,
      topicId,
    )
    return target
  }
}
