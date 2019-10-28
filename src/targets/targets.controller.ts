import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { TargetsService } from './targets.service'
import { MaxTargetsGuard } from './max-targets.guard'
import { CreateTargetDto, TargetDto } from '../dto'

@Controller('targets')
export class TargetsController {
  constructor(
    private readonly targetservice: TargetsService,
  ) { }

  @UseGuards(AuthGuard(), MaxTargetsGuard)
  @Post()
  async create(
    @Request() { user },
    @Body() { title, radius, latitude, longitude, topicId }: CreateTargetDto,
  ): Promise<TargetDto> {
    const target = await this.targetservice.create(
      title,
      radius,
      latitude,
      longitude,
      user,
      topicId,
    )
    return TargetDto.from(target)
  }

  @UseGuards(AuthGuard())
  @Get()
  async index(@Request() { user }): Promise<TargetDto[]>{
    const targets = await this.targetservice.findByUser(user)
    return TargetDto.fromArray(targets)
  }
}
