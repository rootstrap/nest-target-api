import { Module } from '@nestjs/common'
import { ScheduleModule as Scheduler } from 'nest-schedule'

import { SchedulerService } from './scheduler.service'
import { TargetsModule } from '../targets/targets.module'

@Module({
  providers: [SchedulerService],
  imports: [
    TargetsModule,
    Scheduler.register(),
  ]
})
export class SchedulerModule {}
