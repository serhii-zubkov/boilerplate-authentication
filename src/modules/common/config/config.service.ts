import { get } from 'lodash';
import { Injectable } from '@nestjs/common';
import ProcessEnv = NodeJS.ProcessEnv;
import * as dotenv from 'dotenv';
dotenv.config();
import { Tag } from 'constants/index';

interface AppConfig {
  env: object;
}

@Injectable()
export class ConfigurationService {
  private readonly appConfig: AppConfig;

  constructor() {
    this.appConfig = this.getAppConfiguration(process.env);
  }

  public get<T>(setting: string): T {
    const processEnv = get(this.appConfig.env, setting, null);
    const configVariable = get(this.appConfig, setting, null);
    return (processEnv || configVariable) as T;
  }

  private getAppConfiguration(env: ProcessEnv) {
    return {
      NODE_ENV: 'development',
      PORT: 3000,
      prefix: 'v1/api',
      logger: {
        name: 'Boilerplate Authentication API',
        context: 'CustomLogger',
      },
      swagger: {
        path: '/docs',
        title: 'Boilerplate Authentication API',
        description: 'Boilerplate Authentication API docs',
        version: '1.0',
        tags: Object.keys(Tag).map((key) => Tag[key]),
      },
      auth: {
        secret: 'boilerplate-authentication',
        signOptions: { expiresIn: '60s' },
      },
      database: {
        type: process.env.DB_CLIENT || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT) || 5432,
        entities: ['dist/src/modules/crud/**/entities/*.entity{.ts,.js}'],
        migrations: ['dist/src/database/migrations/*.{ts,js}'],
        cli: {
          migrationsDir: 'src/database/migrations',
        },
        synchronize: false,
      },
      env,
    };
  }
}
