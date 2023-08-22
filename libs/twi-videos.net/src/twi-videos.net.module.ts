import { Module } from '@nestjs/common';
import { TwiVideosNetService } from './twi-videos.net.service';

@Module({
  providers: [TwiVideosNetService],
  exports: [TwiVideosNetService],
})
export class TwiVideosNetModule {}
