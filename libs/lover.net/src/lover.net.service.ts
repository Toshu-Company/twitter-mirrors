import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { Category, VideoInfo } from './vo/VideoInfo.vo';
import { SearchResult, SearchResultVideo } from './vo/SearchResult.vo';
import * as vm from 'vm';

export const HOST = 'https://lover922.net';

@Injectable()
export class LoverNetService {
  constructor(private readonly httpService: HttpService) {}

  private async parseSearchResult(
    $: cheerio.CheerioAPI,
  ): Promise<SearchResult> {
    const noticeId = ['34415', '32000'];

    const videos: SearchResultVideo[] = [];
    $('.title a').each((i, el) => {
      const $el = $(el);
      const video = {
        id: $el.attr('href')?.match(/document_srl=(\d+)/)?.[1],
        title: $el.text()?.split('[')[1]?.split(']')[1],
      };
      if (video.id && !noticeId.includes(video.id)) {
        videos.push(video as SearchResultVideo);
      }
    });

    return {
      videos,
      count: videos.length,
    };
  }

  async recent(): Promise<SearchResult> {
    return await this.httpService.axiosRef
      .get(`https://lover922.net/index.php`)
      .then((res) => cheerio.load(res.data))
      .then(this.parseSearchResult);
  }

  async index(page: number): Promise<SearchResult> {
    return await this.httpService.axiosRef
      .get(`https://lover922.net/index.php?page=${page}`)
      .then((res) => cheerio.load(res.data))
      .then(this.parseSearchResult);
  }

  async getVideoInfo(id: string) {
    return await this.httpService.axiosRef
      .get(`https://lover922.net/index.php?document_srl=${id}`)
      .then((res) => cheerio.load(res.data))
      .then(async ($) => {
        const _video_origin = [...$('script[src]')].find((x) =>
          x.attribs.src?.startsWith('/2'),
        )?.attribs.src;
        const _video_content = $(
          [...$('script:not([src])')].find((x) =>
            $(x).text().trim().startsWith('var u'),
          ),
        ).text();

        let vid = undefined;

        if (_video_origin) {
          vid = await this.httpService.axiosRef
            .get(`${HOST}/${_video_origin}`)
            .then((res) =>
              vm.runInNewContext(res.data.replace('var ', ''), {}),
            );
        } else if (_video_content) {
          vid = vm.runInNewContext(_video_content.replace('var ', ''), {});
        }
        if (!vid) {
          throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }

        const $url = `https://tistpry.com/${vid}/master7.m3u8`;
        const $category = $('div.read_header h1 a:nth-child(1)').text();
        const $title = $('div.read_header h1 a:nth-child(2)')
          .text()
          .split('[')[1]
          .split(']')[1];

        return {
          id,
          title: $title,
          video: $url,
          category: $category as Category,
        };
      });
  }
}
