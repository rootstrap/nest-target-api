import { ConfigModule } from 'config/config.module'
import { ConfigService } from 'config/config.service'

export default {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    dropSchema: true,
    ...configService.ormConfig,
  }),
  inject: [ConfigService],
}
