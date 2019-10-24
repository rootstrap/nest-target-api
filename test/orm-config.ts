import { ConfigModule } from '../src/config/config.module'
import { ConfigService } from '../src/config/config.service'

export default  {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    dropSchema: true,
    ...configService.ormConfig,
  }),
  inject: [ConfigService],
}
