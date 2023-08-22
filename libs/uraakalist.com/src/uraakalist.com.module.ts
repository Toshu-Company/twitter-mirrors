import { Module } from '@nestjs/common';
import { UraakalistComService } from './uraakalist.com.service';
import { AxiosModule } from '@app/axios';

@Module({
  imports: [AxiosModule],
  providers: [UraakalistComService],
  exports: [UraakalistComService],
})
export class UraakalistComModule {}
