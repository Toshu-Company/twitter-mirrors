import { Module } from '@nestjs/common';
import { YatvNetService } from './yatv.net.service';

@Module({
  providers: [YatvNetService],
  exports: [YatvNetService],
})
export class YatvNetModule {}
