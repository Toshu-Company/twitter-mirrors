import { Module } from '@nestjs/common';
import { TwidougaNetService } from './twidouga.net.service';

@Module({
  providers: [TwidougaNetService],
  exports: [TwidougaNetService],
})
export class TwidougaNetModule {}
