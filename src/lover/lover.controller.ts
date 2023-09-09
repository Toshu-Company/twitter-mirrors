import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { LoverNetService } from '@twitter/lover.net/lover.net.service';
import { SearchResult } from '@twitter/lover.net/vo/SearchResult.vo';
import { VideoInfo } from '@twitter/lover.net/vo/VideoInfo.vo';

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
}
