import { Module } from '@nestjs/common';
import { TwiVideosService } from './twi-videos.service';
import { TwiVideosController } from './twi-videos.controller';
import { TwiVideosNetModule } from '@twitter/twi-videos.net';

@Module({
  imports: [TwiVideosNetModule],
  controllers: [TwiVideosController],
  providers: [TwiVideosService],
})
export class TwiVideosModule {}
