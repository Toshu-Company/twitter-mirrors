import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { YatvNetService } from '@twitter/yatv.net';

@Controller('yatv')
export class YatvController {
  constructor(private readonly yatvNetService: YatvNetService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  async index(@Query('page') page = 1) {
    return await this.yatvNetService.index(page);
  }

  @Get('detail')
  @ApiQuery({ name: 'url', required: true })
  async getVideoInfo(@Query('url') url: string) {
    return await this.yatvNetService.detail(url);
  }
}
