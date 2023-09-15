import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiProduces } from '@nestjs/swagger';
import { LoverNetService } from '@twitter/lover.net/lover.net.service';
import { SearchResult } from '@twitter/lover.net/vo/SearchResult.vo';
import { VideoInfo } from '@twitter/lover.net/vo/VideoInfo.vo';
import { Response } from 'express';
import { NoCache } from 'src/decorators/cache.decorator';

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

  @Get('/:year/:month/:day/:id/:path')
  @NoCache()
  async mirrorVideoStream(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
    @Param('id') id: string,
    @Param('path') path: string,
    @Res() res: Response,
  ) {
    const stream = await this.loverNetService.mirrorVideoStream(
      `${year}/${month}/${day}/${id}/${path}`,
    );
    if (stream.headers['content-type'])
      res.setHeader('Content-Type', stream.headers['content-type']);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    stream.data.pipe(res);
  }
}
