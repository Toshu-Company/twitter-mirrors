import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { TwivideoNetService } from '@twitter/twivideo.net';
import { VideoType } from '@twitter/twivideo.net/vo/VideoType';

@Controller('twivideo')
@ApiTags('twivideo.net')
export class TwivideoController {
  constructor(private readonly twivideoNetService: TwivideoNetService) {}

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
}
