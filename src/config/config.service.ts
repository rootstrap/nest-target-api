import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      PORT: Joi.number().default(3000),
      JWT_SECRET: Joi.string().default('defaultSecret'),
      BCRYPT_SALTS_NUMBER: Joi.number().default(10),
      JWT_EXPIRES: Joi.string().default('1w'),
      ORM_TYPE: Joi.string().default('postgres'),
      ORM_HOST: Joi.string().default('localhost'),
      ORM_PORT: Joi.number().default(5432),
      ORM_USERNAME: Joi.string().default('postgres'),
      ORM_PASSWORD: Joi.string().allow('').default(''),
      ORM_DATABASE: Joi.string().default('test'),
      ORM_SYNCRONIZE: Joi.boolean().default(true),
      ORM_ENTITIES: Joi.string().default('dist/**/*.entity{.ts,.js}'),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }

  get bcryptSaltsNumber(): number {
    return parseInt(this.envConfig.BCRYPT_SALTS_NUMBER);
  }

  get jwtExpiry(): string {
    return this.envConfig.JWT_EXPIRES;
  }

  get ormConfig(): object {
    return {
      type: this.envConfig.ORM_TYPE,
      host: this.envConfig.ORM_HOST,
      port: this.envConfig.ORM_PORT,
      username: this.envConfig.ORM_USERNAME,
      password: this.envConfig.ORM_PASSWORD,
      database: this.envConfig.ORM_DATABASE,
      entities:  [this.envConfig.ORM_ENTITIES],
      synchronize: this.envConfig.ORM_SYNCRONIZE,
    };
  }
}
