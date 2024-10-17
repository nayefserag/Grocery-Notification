import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: any;
}

export class ConfigService {
  private static instance: ConfigService = null;
  private readonly env: EnvConfig;

  constructor(filePath: string = './.env') {
    const configs = dotenv.parse(fs.readFileSync(filePath)); // Load .env file
    this.env = this.validateInput(configs); // Validate and parse the configs
  }

  // Singleton pattern to get the ConfigService instance
  static getInstance(): ConfigService {
    if (!this.instance) {
      this.instance = new ConfigService(`${process.env.NODE_ENV || ''}.env`);
    }
    return this.instance;
  }

  // Getter methods to fetch environment variables
  getString(key: string): string {
    return this.env[key];
  }

  getNumber(key: string): number {
    return parseFloat(this.env[key]);
  }

  getBoolean(key: string): boolean {
    return this.env[key] === 'true';
  }

  // Validate the environment variables using Joi
  private validateInput(env: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({

      PORT: Joi.number().default(5000),

      // Database-related environment variables
      DATABASE_HOST: Joi.string().required(),
      DATABASE_PORT: Joi.number().default(3306),
      DATABASE_USERNAME: Joi.string().required(),
      DATABASE_PASSWORD: Joi.string().required(),
      DATABASE_SCHEMA: Joi.string().required(),
      DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
      DATABASE_LOGGING: Joi.boolean().default(false),

      // RabbitMQ-related environment variables
      RABBITMQ_1_HOST: Joi.string().required(),
      RABBITMQ_1_PORT: Joi.number().default(5672),
      RABBITMQ_1_USER_NAME: Joi.string().required(),
      RABBITMQ_1_PASSWORD: Joi.string().required(),
      RABBITMQ_1_VHOST: Joi.string().default('/'),
      RABBITMQ_1_HEART_BEAT: Joi.number().default(15),

      // JWT and security-related environment variables
      JWT_SECRET: Joi.string().required(),
      JWT_SECRET_REFRESH: Joi.string().required(),
      SALT_ROUNDS: Joi.number().default(1000),
      RESET_PASSWORD_SECRET: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(env, {
      allowUnknown: true,
    });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}


const config = ConfigService.getInstance();
export { config };
