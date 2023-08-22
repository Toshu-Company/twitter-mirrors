import { Module } from '@nestjs/common';
import { TwivideoNetService } from './twivideo.net.service';

@Module({
  providers: [TwivideoNetService],
  exports: [TwivideoNetService],
})
export class TwivideoNetModule {}
