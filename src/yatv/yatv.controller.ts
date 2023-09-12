import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { YatvNetService } from '@twitter/yatv.net';
import { MirrorDto } from './dto/mirror.dto';
import { Response } from 'express';

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

  @Post('mirror')
  async mirror(@Body() body: MirrorDto, @Res() res: Response) {
    const stream = await this.yatvNetService.mirror(body.url);
    res.setHeader('Content-Type', stream.headers['content-type']);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    stream.data.pipe(res);
  }
}
