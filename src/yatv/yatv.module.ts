import { Module } from '@nestjs/common';
import { YatvService } from './yatv.service';
import { YatvController } from './yatv.controller';
import { YatvNetModule } from '@twitter/yatv.net';

@Module({
  imports: [YatvNetModule],
  controllers: [YatvController],
  providers: [YatvService],
})
export class YatvModule {}
