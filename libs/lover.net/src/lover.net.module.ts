import { Module } from '@nestjs/common';
import { LoverNetService } from './lover.net.service';
import { AxiosModule } from '@app/axios';

@Module({
  imports: [AxiosModule],
  providers: [LoverNetService],
  exports: [LoverNetService],
})
export class LoverNetModule {}
