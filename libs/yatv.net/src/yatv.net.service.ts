import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as vm from 'vm';
import { Result } from './vo';
import { Readable } from 'stream';

@Injectable()
export class YatvNetService {
  constructor(private readonly httpService: HttpService) { }

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
      .then((url) =>
        url
          ? {
            url: url,
            thumbnail: new URL(url).searchParams.get('img'),
          }
          : undefined,
      );

    if (!url) return undefined;

    console.log(url);

    const result = await this.httpService.axiosRef
      .get(url.url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
          Referer: 'https://yatv.net/',
        },
      })
      .then((res) => cheerio.load(res.data))
      .then(($) => $('script:not([src])').text())
      .then((script) =>
        vm.runInNewContext(script, { play: (a: any, b: any, c: any) => c }),
      );

    return {
      video: result,
      thumbnail: url.thumbnail,
      message: 'Referer header must be set to "https://hellocdn1.net/".',
    };
  }

  async mirror(url: string) {
    const stream = await this.httpService.axiosRef.get<Readable>(url, {
      headers: {
        Referer: 'https://hellocdn1.net/',
      },
      responseType: 'stream',
    });
    return stream;
  }
}
