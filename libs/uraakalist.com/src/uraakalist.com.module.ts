import { Module } from '@nestjs/common';
import { UraakalistComService } from './uraakalist.com.service';

@Module({
  providers: [UraakalistComService],
  exports: [UraakalistComService],
})
export class UraakalistComModule {}
