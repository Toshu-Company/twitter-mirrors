import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { Category } from './vo/VideoInfo.vo';
import { SearchResult, SearchResultVideo } from './vo/SearchResult.vo';
import * as vm from 'vm';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import MemoryStream from 'memorystream';
import { Readable } from 'stream';

export const HOST = 'https://lover922.net';

@Injectable()
export class LoverNetService {
  constructor(private readonly httpService: HttpService) {}

  private async parseSearchResult(
    $: cheerio.CheerioAPI,
  ): Promise<SearchResult> {
    const videos: SearchResultVideo[] = [];
    $('tr:not(.notice) .title a').each((i, el) => {
      const $el = $(el);
      const video = {
        id: $el.attr('href')?.match(/document_srl=(\d+)/)?.[1],
        title: $el
          .text()
          .replace(/\[.*\]/, '')
          .trim(),
      };
      if (video.id) {
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

  async getThumbnail(id: string) {
    //   const video = (await this.getVideoInfo(id)).video;
    //   const stream = new MemoryStream();
    //   ffmpeg()
    //     .input(video)
    //     .seekInput(0)
    //     // .keepDisplayAspectRatio()
    //     // .size('320x240')
    //     .videoFilter('scale=-1:240')
    //     // .videoFilter(
    //     //   'scale=if(gte(iw,ih),min(320,iw),-1):if(lt(iw,ih),min(240,ih),-1)',
    //     // )
    //     .outputOptions('-vframes 1')
    //     .format('image2')
    //     .pipe(stream);
    //   return stream;
    // }
    return new Promise<fs.ReadStream>(async (resolve, reject) => {
      const video = (await this.getVideoInfo(id)).video;
      const filename = path.join('tmp', `${id}.jpg`);
      if (!fs.existsSync('tmp')) {
        fs.mkdirSync('tmp');
      }
      if (fs.existsSync(filename)) {
        return fs.createReadStream(filename);
      }
      ffmpeg()
        .input(video)
        .seekInput(0)
        .videoFilter('scale=-1:240')
        .outputOptions('-vframes 1')
        .format('image2')
        .pipe(
          fs
            .createWriteStream(filename, {
              encoding: 'binary',
            })
            .on('finish', () => {
              resolve(fs.createReadStream(filename));
            }),
        );
    });
  }

  async mirrorVideoStream(path: string) {
    const stream = await this.httpService.axiosRef.get<Readable>(
      `https://tistpry.com/${path}`,
      {
        responseType: 'stream',
      },
    );
    return stream;
  }
}
