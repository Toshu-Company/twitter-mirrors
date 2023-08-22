import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  HotRangeType,
  RankingType,
  UraakalistComService,
  UserType,
} from '@twitter/uraakalist.com';

@Controller('uraakalist')
@ApiTags('uraakalist.com')
export class UraakalistController {
  constructor(private readonly uraakalistComService: UraakalistComService) {}

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  index(@Query('page') page = 1) {
    return this.uraakalistComService.new(page);
  }

  @Get('recommend')
  @ApiQuery({ name: 'page', type: Number, required: false })
  recommend(@Query('page') page = 1) {
    return this.uraakalistComService.recommend(page);
  }

  @Get('like')
  @ApiQuery({ name: 'page', type: Number, required: false })
  like(@Query('page') page = 1) {
    return this.uraakalistComService.like(page);
  }

  @Get('retweet')
  @ApiQuery({ name: 'page', type: Number, required: false })
  retweet(@Query('page') page = 1) {
    return this.uraakalistComService.retweet(page);
  }

  @Get('hot')
  @ApiQuery({ name: 'range', enum: HotRangeType })
  @ApiQuery({ name: 'page', type: Number, required: false })
  hot(@Query('range') range = HotRangeType.DAY, @Query('page') page = 1) {
    return this.uraakalistComService.hot(range, page);
  }

  @Get('ranking')
  @ApiQuery({ name: 'type', enum: RankingType, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  ranking(@Query('type') type = RankingType.VIDEO, @Query('page') page = 1) {
    return this.uraakalistComService.ranking(type, page);
  }

  @Get('search')
  @ApiQuery({ name: 'query', type: String })
  @ApiQuery({ name: 'image', type: Boolean, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  search(
    @Query('query') query: string,
    @Query('image') image: boolean,
    @Query('page') page = 1,
  ) {
    return this.uraakalistComService.search(query, image, page);
  }

  @Get('detail/:id')
  detail(@Param('id') id: string) {
    return this.uraakalistComService.detail(id);
  }

  @Get('keywords')
  keywords() {
    return this.uraakalistComService.keywords();
  }

  @Get('users')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({
    name: 'type',
    enum: UserType,
    required: false,
  })
  users(@Query('page') page = 1, @Query('type') type = UserType.NEW) {
    return this.uraakalistComService.users(type, page);
  }
}
