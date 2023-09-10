import { Module } from '@nestjs/common';
import { LoverService } from './lover.service';
import { LoverController } from './lover.controller';
import { LoverNetModule } from '@twitter/lover.net';

@Module({
  imports: [LoverNetModule],
  controllers: [LoverController],
  providers: [LoverService],
})
export class LoverModule {}
