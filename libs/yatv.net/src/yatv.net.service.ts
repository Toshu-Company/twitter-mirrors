import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { Result } from './vo';

@Injectable()
export class YatvNetService {
  cookie: string[] | undefined = undefined;

  constructor(private readonly httpService: HttpService) {
    (async () => {
      const res = await this.httpService.axiosRef.get('https://yatv.net/', {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        },
      });
      this.cookie = res.headers['set-cookie'];
    })();
  }

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

  async index(page = 1) {
    const result = await this.httpService.axiosRef
      .get(
        `https://yatv.net/%ED%95%9C%EA%B5%AD%EC%95%BC%EB%8F%99/%EC%95%BC%EB%8F%99%EB%AA%A9%EB%A1%9D-${page}`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            Referer: `https://yatv.net/%ED%95%9C%EA%B5%AD%EC%95%BC%EB%8F%99/%EC%95%BC%EB%8F%99%EB%AA%A9%EB%A1%9D-${page}`,
          },
        },
      )
      .then((res) => cheerio.load(res.data))
      .then(this.parseSearchResult);

    return result;
  }

  async detail(path: string) {
    const url = await this.httpService.axiosRef
      .get(`https://yatv.net/${path}`, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
          Referer: `https://yatv.net/${path}`,
        },
      })
      .then((res) => cheerio.load(res.data))
      .then(($) => $('iframe#movie').attr('src'))
      .then(
        (url) =>
          url && {
            url: url,
            thumbnail: new URL(url).searchParams.get('img'),
          },
      );

    return url;
  }
}
