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

}
