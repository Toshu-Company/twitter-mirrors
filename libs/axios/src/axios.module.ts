import { Module } from '@nestjs/common';
import { AxiosService } from './axios.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: AxiosService,
    }),
  ],
  exports: [HttpModule],
})
export class AxiosModule {}
