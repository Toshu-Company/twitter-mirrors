import { Module } from '@nestjs/common';
import { UraakaJoshiComService } from './uraaka-joshi.com.service';
import { AxiosModule } from '@app/axios';

@Module({
  imports: [AxiosModule],
  providers: [UraakaJoshiComService],
  exports: [UraakaJoshiComService],
})
export class UraakaJoshiComModule {}
