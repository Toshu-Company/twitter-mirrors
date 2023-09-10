import { Module } from '@nestjs/common';
import { YatvNetService } from './yatv.net.service';
import { AxiosModule } from '@app/axios';

@Module({
  imports: [AxiosModule],
  providers: [YatvNetService],
  exports: [YatvNetService],
})
export class YatvNetModule {}
