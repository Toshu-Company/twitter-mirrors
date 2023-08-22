import { Module } from '@nestjs/common';
import { TwidougaService } from './twidouga.service';
import { TwidougaController } from './twidouga.controller';
import { TwidougaNetModule } from '@twitter/twidouga.net';

@Module({
  imports: [TwidougaNetModule],
  controllers: [TwidougaController],
  providers: [TwidougaService],
})
export class TwidougaModule {}
