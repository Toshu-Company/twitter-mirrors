import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { Result } from './vo';

@Injectable()
export class YatvNetService {
  constructor(private readonly httpService: HttpService) {}

  parseSearchResult($: cheerio.CheerioAPI): Result[] {
    const videos: Result[] = [];
    $('article.post').each((i, el) => {
      const $el = $(el);
      const thumbnail = $el.find('img').attr('src');
      const title = $el.find('h3').text().trim();
      const upload_date = $el.find('div.up').text().trim();
      const playtime = $el.find('div.pt').text().trim();
      const url = $el.find('a').attr('href');

      if (!url) return;

      videos.push({
        thumbnail,
        title,
        upload_date,
        playtime,
        url,
      });
    });
    return videos;
  }

  index(page = 1) {
    const result = this.httpService.get(
      `https://yatv.net/%ED%95%9C%EA%B5%AD%EC%95%BC%EB%8F%99/%EC%95%BC%EB%8F%99%EB%AA%A9%EB%A1%9D-${page}`,
    );
  }
}
