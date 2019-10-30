import { Controller, Post, UseGuards, Request, Body, Get, Delete, HttpCode, Param  } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { RecordNotFoundException } from '../exceptions/record-not-found.exception'
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
  ): Promise<{ target: TargetDto, matches: TargetDto[] }> {
    const { target, matches } = await this.targetservice.create(
      title,
      radius,
      latitude,
      longitude,
      user,
      topicId,
    )

    return {
      target: TargetDto.from(target),
      matches: TargetDto.fromArray(matches),
    }
  }

  @UseGuards(AuthGuard())
  @Get()
  async index(@Request() { user }): Promise<TargetDto[]>{
    const targets = await this.targetservice.findByUser(user)
    return TargetDto.fromArray(targets)
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Request() { user },
    @Param('id') id,
  ): Promise<void>{
    const deletedTargets = await this.targetservice.deleteByUser(user, parseInt(id))
    if (!deletedTargets) throw new RecordNotFoundException('Target')
  }
}
