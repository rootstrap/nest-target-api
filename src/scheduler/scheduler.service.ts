import { Injectable } from '@nestjs/common'
import { Cron, NestSchedule } from 'nest-schedule'


import { TargetsService } from '../targets/targets.service'

@Injectable()
export class SchedulerService extends NestSchedule {
  constructor(
    private readonly targetservice: TargetsService,
  ) { super() }

  @Cron('* * * * *')
  async cleanTargets() {
    await this.targetservice.cleanOldTargets()
  }
}
