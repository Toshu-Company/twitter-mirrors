import { Module } from '@nestjs/common';
import { TwivideoNetService } from './twivideo.net.service';
import { AxiosModule } from '@app/axios';

@Module({
  imports: [AxiosModule],
  providers: [TwivideoNetService],
  exports: [TwivideoNetService],
})
export class TwivideoNetModule {}
