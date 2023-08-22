import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Language, TwidougaNetService } from '@twitter/twidouga.net';

@Controller('twidouga')
@ApiTags('twidouga.net', 'deprecated')
export class TwidougaController {
  constructor(private readonly twidougaService: TwidougaNetService) {}

  @Get()
  @ApiQuery({ name: 'language', enum: Language, required: false })
  getIndex(@Query('language') language: Language = Language.Korean) {
    return this.twidougaService.getLive(language);
  }
}
