import { Module } from '@nestjs/common';
import { TwiVideosNetService } from './twi-videos.net.service';
import { AxiosModule } from '@app/axios';

@Module({
  imports: [AxiosModule],
  providers: [TwiVideosNetService],
  exports: [TwiVideosNetService],
})
export class TwiVideosNetModule {}
