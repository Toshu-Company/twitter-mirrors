import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { SearchResult, SearchResultVideo } from './vo/SearchResult.vo';
import { VideoInfo } from './vo/VideoInfo.vo';
import { VideoDetail } from './vo/VideoDetail.vo';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TwiVideosNetService {
  constructor(private readonly httpService: HttpService) {}

  private async parseSearchResult(
    $: cheerio.CheerioAPI,
  ): Promise<SearchResult> {
    const count = parseInt(
      $('h3').text().trim().match(/\d+/)?.[0] ??
        (/[^\d]/.test($('p').first().text().trim())
          ? '0'
          : $('p').first().text().trim()) ??
        '0',
    );

    const videos: SearchResultVideo[] = [];
    $('a:has(img)').each((i, el) => {
      const $el = $(el);
      const video = {
        id: $el.attr('href')?.match(/video=(\d+)/)?.[1],
        thumbnail: $el.find('img').attr('data-src'),
      };
      if (video.id) {
        videos.push(video as SearchResultVideo);
      }
    });

    return {
      videos,
      count,
    };
  }

  async recent4(): Promise<SearchResult> {
    return await this.httpService.axiosRef
      .get('https://www.twi-videos.net/')
      .then((res) => cheerio.load(res.data))
      .then(this.parseSearchResult);
  }

  async index(page: number): Promise<SearchResult> {
    return await this.httpService.axiosRef
      .get(`https://www.twi-videos.net/hozon.php?p=${page}`)
      .then((res) => cheerio.load(res.data))
      .then(this.parseSearchResult);
  }

  async randomId(): Promise<string | undefined> {
    return await this.httpService.axiosRef
      .get('https://www.twi-videos.net/')
      .then((res) => cheerio.load(res.data))
      .then(($) => {
        const $h3 = $('h3');
        const $a = $h3.find('a').filter((i, el) => {
          const $el = $(el);
          return $el.text().includes('ランダム');
        });
        const href = $a.attr('href');
        return href?.match(/video=(\d+)/)?.[1];
      });
  }

  async search(query: string, page: number): Promise<SearchResult> {
    return await this.httpService.axiosRef
      .get(`https://www.twi-videos.net/r.php?k=${query}&p=${page}`)
      .then((res) => cheerio.load(res.data))
      .then(this.parseSearchResult)
      .then((result) => {
        if (result.count <= (page - 1) * 30) {
          return { videos: [], count: result.count };
        }
        return result;
      });
  }

  async searchByUser(id: string, page: number): Promise<SearchResult> {
    return await this.httpService.axiosRef
      .get(`https://www.twi-videos.net/r3.php?k=${id}&p=${page}`)
      .then((res) => cheerio.load(res.data))
      .then(this.parseSearchResult)
      .then((result) => {
        if (result.count <= (page - 1) * 30) {
          return { videos: [], count: result.count };
        }
        return result;
      });
  }

  async getVideoInfo(id: string): Promise<VideoInfo> {
    return await this.httpService.axiosRef
      .get(`https://www.twi-videos.net/v.php?video=${id}`)
      .then((res) => cheerio.load(res.data))
      .then(($) => {
        const $field = $('fieldset.fs');
        const $urls = $field.find('a');
        let $user, $tweet, $video;
        // https://twitter.com/112334_0
        // https://twitter.com/112334_0/status/1688937702052560897
        // https://video.twimg.com/ext_tw_video/1688937610507640832/pu/vid/720x1280/gSCNz9GNQtb_RC1J.mp4?tag=12
        const $thumbnail = $field.find('img');
        // https://pbs.twimg.com/ext_tw_video_thumb/1688937610507640832/pu/img/EyZpa_CoK8qV8VG1.jpg
        const $title = $field.find('font > b');
        for (let i = 0; i < $urls.length; i++) {
          const $url = $($urls[i]);
          const href = $url.attr('href');
          if (href?.includes('twitter.com')) {
            if (href.includes('/status/')) {
              $tweet ??= $url;
            } else {
              $user ??= $url;
            }
          } else if (href?.includes('video.twimg.com')) {
            $video ??= $url;
          }
        }
        return {
          id,
          user: {
            name: $user?.text(),
            screen_name: $user?.attr('href')?.match(/\/(\w+)$/)?.[1],
            profile_url: $tweet?.attr('href'),
          },
          tweet: $tweet?.attr('href'),
          title: $title?.text(),
          thumbnail: $thumbnail?.attr('src'),
          video: $video?.attr('href'),
        } as VideoInfo;
      });
  }

  async getVideoDetail(id: string): Promise<VideoDetail> {
    return this.httpService.axiosRef
      .get(`https://www.twi-videos.net/j/${id}.json`)
      .then((res) => res.data);
  }
}
