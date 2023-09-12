import {
  CacheModule,
  ClassSerializerInterceptor,
  Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import ms from 'ms';
import { DatabaseModule } from './database.module';
import { TwiVideosModule } from './twi-videos/twi-videos.module';
import { TwivideoModule } from './twivideo/twivideo.module';
import { UraakalistModule } from './uraakalist/uraakalist.module';
import { TwidougaModule } from './twidouga/twidouga.module';
import { LoverModule } from './lover/lover.module';
import { YatvModule } from './yatv/yatv.module';
import { CacheInterceptor } from './intercepters/cache.intercepter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`../../../.env`, `.env`],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: ms('1m'),
      max: 100,
    }),
    TwiVideosModule,
    TwivideoModule,
    UraakalistModule,
    TwidougaModule,
    LoverModule,
    YatvModule,
    // DatabaseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
