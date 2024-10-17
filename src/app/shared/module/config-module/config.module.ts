import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { EmailConfigService } from './email-config.service';
@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: ConfigService.getInstance(),
    },
    EmailConfigService
  ],
  exports: [ConfigService ],
})
export class ConfigModule {}
