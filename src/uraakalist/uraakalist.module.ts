import { Module } from '@nestjs/common';
import { UraakalistService } from './uraakalist.service';
import { UraakalistController } from './uraakalist.controller';
import { UraakalistComModule } from '@twitter/uraakalist.com';

@Module({
  imports: [UraakalistComModule],
  controllers: [UraakalistController],
  providers: [UraakalistService],
})
export class UraakalistModule {}
