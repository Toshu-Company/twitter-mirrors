import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TwivideoNetService } from '@twitter/twivideo.net';
import { VideoType } from '@twitter/twivideo.net/vo/VideoType';
import { TwivideoService } from './twivideo.service';

@Controller('twivideo')
@ApiTags('twivideo.net')
export class TwivideoController {
  constructor(
    private readonly twivideoService: TwivideoService,
    private readonly twivideoNetService: TwivideoNetService,
  ) {}

  @Get()
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'type', enum: VideoType, required: false })
  async index(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('type') type: VideoType,
  ) {
    return await this.twivideoNetService.getVideos(
      offset,
      limit,
      type || VideoType.LIVE_DL,
    );
  }

  @Post('mirror')
  @ApiBody({
    schema: { type: 'object', properties: { url: { type: 'string' } } },
  })
  async mirror(@Body('url') url: string) {
    return await this.twivideoService.mirror(url);
  }
}
