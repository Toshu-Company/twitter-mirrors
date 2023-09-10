import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiHeader,
  ApiHeaders,
  ApiExtension,
  ApiProduces,
} from '@nestjs/swagger';
import { LoverNetService } from '@twitter/lover.net/lover.net.service';
import { SearchResult } from '@twitter/lover.net/vo/SearchResult.vo';
import { VideoInfo } from '@twitter/lover.net/vo/VideoInfo.vo';
import { Response } from 'express';

@Controller('lover')
@ApiTags('lover.net')
export class LoverController {
  constructor(private readonly loverNetService: LoverNetService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  async index(@Query('page') page = 1): Promise<SearchResult> {
    return await this.loverNetService.index(page);
  }

  @Get('recent')
  async recent(): Promise<SearchResult> {
    return await this.loverNetService.recent();
  }

  @Get('video')
  @ApiQuery({ name: 'id', required: true })
  async getVideoInfo(@Query('id') id: string): Promise<VideoInfo> {
    return await this.loverNetService.getVideoInfo(id);
  }

  @Get('thumbnail')
  @ApiProduces('image/jpeg')
  @ApiQuery({ name: 'id', required: true })
  async getVideoStream(@Query('id') id: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'image/jpeg');
    (await this.loverNetService.getThumbnail(id)).pipe(res);
  }
}
