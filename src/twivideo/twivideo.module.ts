import { Module } from '@nestjs/common';
import { TwivideoService } from './twivideo.service';
import { TwivideoController } from './twivideo.controller';
import { TwivideoNetModule } from '@twitter/twivideo.net';

@Module({
  imports: [TwivideoNetModule],
  controllers: [TwivideoController],
  providers: [TwivideoService],
})
export class TwivideoModule {}
