import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TwiVideosNetService } from '@twitter/twi-videos.net';
import { SearchResult } from '@twitter/twi-videos.net/vo/SearchResult.vo';
import { VideoDetail } from '@twitter/twi-videos.net/vo/VideoDetail.vo';
import { VideoInfo } from '@twitter/twi-videos.net/vo/VideoInfo.vo';

@Controller('twi-videos')
@ApiTags('twi-videos.net')
export class TwiVideosController {
  constructor(private readonly twiVideosNetService: TwiVideosNetService) {}

  @Get()
  async index(@Query('page') page: number): Promise<SearchResult> {
    return await this.twiVideosNetService.index(page);
  }

  @Get('recent')
  async recent(): Promise<SearchResult> {
    return await this.twiVideosNetService.recent4();
  }

  @Get('random')
  async random(): Promise<VideoDetail> {
    const id = await this.twiVideosNetService.randomId();
    if (!id) throw new NotFoundException();
    return await this.twiVideosNetService.getVideoDetail(id);
  }

  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('page') page: number,
  ): Promise<SearchResult> {
    return await this.twiVideosNetService.search(query, page);
  }

  @Get('search/user')
  async searchUser(
    @Query('id') id: string,
    @Query('page') page: number,
  ): Promise<SearchResult> {
    return await this.twiVideosNetService.searchByUser(id, page);
  }

  @Get(':id')
  async getVideoInfo(@Param('id') id: string): Promise<VideoInfo> {
    return await this.twiVideosNetService.getVideoInfo(id);
  }

  @Get(':id/detail')
  async getVideoDetail(@Param('id') id: string): Promise<VideoDetail> {
    return await this.twiVideosNetService.getVideoDetail(id);
  }
}
