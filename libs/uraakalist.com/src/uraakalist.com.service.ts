import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { Result, TweetDetail } from './vo';
import { HttpService } from '@nestjs/axios';

export enum HotRangeType {
  DAY = '',
  HALF_WEEK = 'halfweek/',
  WEEK = 'week/',
  MONTH = 'month/',
}

export enum RankingType {
  VIDEO = 'video/',
  IMAGE = 'image/',
  USER = 'pv/',
}

export enum UserType {
  NEW = '',
  PICKUP = 'pickup/',
  AMATEUR = 'amateur/',
  HAMEDORI = 'hamedori/',
  COSPLAYER = 'cosplayer/',
  /* TRANCE = 'trance' */
}

@Injectable()
export class UraakalistComService {
  constructor(private readonly httpService: HttpService) {}

  private parseSearchResult($: cheerio.CheerioAPI): Result {
    const tweets: Result['tweets'] = [];
    $('div.tweet_list > article.tweet').each((i, el) => {
      const $el = $(el);
      const url = $el.find('a.tweet_img').attr('href');
      const id = url?.match(/tweet\/(\d+)/)?.[1];
      const thumbnail = $el.find('a.tweet_img > img').attr('src');
      const isVideo = $el.find('span.tweet_icon').text().includes('slideshow');

      tweets.push({
        id: id ?? '',
        thumbnail: thumbnail ?? '',
        url: url ?? '',
        type: isVideo ? 'video' : 'image',
      });
    });
    return {
      tweets,
      users: [],
      keywords: [],
    };
  }

  private parseUsersResult($: cheerio.CheerioAPI): Result {
    const users: Result['users'] = [];
    $('div.tweet_list > article.tweet').each((i, el) => {
      const $el = $(el);
      const url = $el.find('a.tweet_img').attr('href');
      const id = url?.match(/\/content\/(.+)/)?.[1];
      const tag = $el.find('p.tweet_id').text().trim();
      const thumbnail = $el.find('a.tweet_img > img').attr('src');

      users.push({
        id: id ?? '',
        tag: tag ?? '',
        thumbnail: thumbnail ?? '',
        url: url ?? '',
      });
    });
    return {
      tweets: [],
      users,
      keywords: [],
    };
  }

  private parseKeywordsResult($: cheerio.CheerioAPI): Result {
    const keywords: Result['keywords'] = [];
    $('div.tag-list > a.tag').each((i, el) => {
      const $el = $(el);
      const keyword = $el.text().trim();

      keywords.push(keyword);
    });
    return {
      tweets: [],
      users: [],
      keywords,
    };
  }

  private async parseTweetDetailResult(
    $: cheerio.CheerioAPI,
  ): Promise<TweetDetail> {
    const content = $('.content');
    const title = content.find('.rect .player-wrap h1').text();
    const video =
      content.find('.rect .player-wrap video source').attr('src') ??
      content.find('.txt-block a').attr('href');
    const image = content.find('.rect .player-wrap img').attr('src');
    const user =
      content
        .find('.rect .player-wrap a')
        .attr('href')
        ?.match(/\/content\/(.+)/)?.[1] ??
      content
        .find('.Breadcrumb .Breadcrumb-ListGroup-Item:nth-child(2) a')
        .attr('href')
        ?.match(/\/content\/(.+)/)?.[1];
    const recommend = this.parseSearchResult(
      cheerio.load(content.find('.tweet_list').first().html() ?? ''),
    );
    const sameUser = this.parseSearchResult(
      cheerio.load(content.find('.tweet_list').last().html() ?? ''),
    );

    return {
      title,
      video: video ?? '',
      image: image ?? '',
      user: user ?? '',
      user_recommend: recommend.tweets,
      recommend: sameUser.tweets,
    };
  }

  private async request(
    page: number,
    type?: string,
    image = false,
  ): Promise<Result> {
    const url = `https://uraakalist.com/${type ? type + '/' : ''}${
      image ? 'image/' : ''
    }p/${page}`;
    return await this.httpService.axiosRef
      .get(url)
      .then((res) => cheerio.load(res.data))
      .then(this.parseSearchResult);
  }

  async new(page = 1): Promise<Result> {
    return this.request(page);
  }

  async recommend(page = 1): Promise<Result> {
    return this.request(page, 'pickup');
  }

  async like(page = 1): Promise<Result> {
    return this.request(page, 'like');
  }

  async retweet(page = 1): Promise<Result> {
    return this.request(page, 'retweet');
  }

  async hot(range = HotRangeType.DAY, page = 1): Promise<Result> {
    return this.request(page, `hot/${range}`);
  }

  async ranking(type = RankingType.VIDEO, page = 1): Promise<Result> {
    return this.request(page, `ranking/${type}`);
  }

  async search(query: string, image = false, page = 1): Promise<Result> {
    return this.request(page, `keyword/${query}`, image);
  }

  async detail(id: string): Promise<TweetDetail> {
    return await this.httpService.axiosRef
      .get(`https://uraakalist.com/tweet/${id}`)
      .then((res) => cheerio.load(res.data))
      .then(this.parseTweetDetailResult);
  }

  async keywords(): Promise<Result> {
    return await this.httpService.axiosRef
      .get(`https://uraakalist.com/tag`)
      .then((res) => cheerio.load(res.data))
      .then(this.parseKeywordsResult);
  }

  async users(type = UserType.NEW, page = 1): Promise<Result> {
    return await this.httpService.axiosRef
      .get(`https://uraakalist.com/list/${type}p/${page}`)
      .then((res) => cheerio.load(res.data))
      .then(this.parseUsersResult);
  }
}
