import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'

import { TargetsService } from './targets.service'

@Injectable()
export class MaxTargetsGuard implements CanActivate {
  constructor(readonly targetsService: TargetsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest()
    return this.targetsService.canCreateTargets(user)
  }
}
