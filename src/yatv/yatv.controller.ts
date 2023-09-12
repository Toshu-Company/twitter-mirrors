import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { YatvNetService } from '@twitter/yatv.net';
import { MirrorDto } from './dto/mirror.dto';
import { Response } from 'express';
import { DetailDto } from './dto/detail.dto';

@Controller('yatv')
export class YatvController {
  constructor(private readonly yatvNetService: YatvNetService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  async index(@Query('page') page = 1) {
    return await this.yatvNetService.index(page);
  }

  @Post('detail')
  async getVideoInfo(@Body() body: DetailDto) {
    return await this.yatvNetService.detail(body.url);
  }

  @Get('mirror')
  @ApiQuery({ name: 'url', required: true })
  async mirrorGet(@Query('url') encoded: string, @Res() res: Response) {
    const url = Buffer.from(encoded, 'base64').toString();
    const stream = await this.yatvNetService.mirror(url);
    res.setHeader('Content-Type', stream.headers['content-type']);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    stream.data.pipe(res);
  }

  @Post('mirror')
  async mirror(@Body() body: MirrorDto, @Res() res: Response) {
    const stream = await this.yatvNetService.mirror(body.url);
    if (body['content-type']) {
      res.setHeader('Content-Type', body['content-type']);
    } else {
      res.setHeader('Content-Type', stream.headers['content-type']);
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    stream.data.pipe(res);
  }
}
