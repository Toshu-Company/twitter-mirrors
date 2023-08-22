import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { VideoType } from './vo/VideoType';
import * as cheerio from 'cheerio';

@Injectable()
export class TwivideoNetService {
  constructor(private readonly httpService: HttpService) {}

  async getVideos(offset = 0, limit = 45, type = VideoType.LIVE_DL) {
    const form = new FormData();
    form.append('offset', offset.toString());
    form.append('limit', limit.toString());
    form.append('tag', 'null');
    form.append('type', type.toString());
    form.append('order', 'post_date');
    form.append('le', '1000');
    form.append('ty', 'p4');
    return await this.httpService.axiosRef
      .post('https://twivideo.net/templates/view_lists.php', form)
      .then((res) => cheerio.load(res.data))
      .then(($) => {
        const videos: any[] = [];
        $('div.item_inner').each((i, el) => {
          const $el = $(el);
          const video = {
            video: $el.find('.item_image a').attr('href'),
            thumbnail: $el.find('.item_image img').attr('src'),
            twitter: $el.find('.tw_icon a').attr('href'),
          };
          videos.push(video);
        });
        return videos;
      });
  }
}
