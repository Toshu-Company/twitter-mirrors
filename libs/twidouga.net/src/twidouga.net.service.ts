import { Injectable } from '@nestjs/common';
import {
  Browser,
  DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
  Page,
} from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import useProxy from 'puppeteer-page-proxy';

export enum Language {
  Korean = 'ko',
  Japanese = 'ja',
}

export interface Video {
  index: number;
  videoThumbnail: string;
  videoUrl: string;
}

@Injectable()
export class TwidougaNetService {
  private browser?: Browser;

  constructor() {
    puppeteer
      .use(StealthPlugin())
      .use(
        AdblockerPlugin({
          interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
          blockTrackers: true,
          blockTrackersAndAnnoyances: true,
          useCache: true,
        }),
      )
      .launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: 'new',
      })
      .then((browser) => {
        this.browser = browser;
      });
  }

  async getLive(language: Language) {
    if (this.browser === undefined) throw new Error('Browser is not ready');

    const page = await this.browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0',
    );

    await useProxy(page, 'socks5h://warproxy:1080');

    // await page.goto(
    //   {
    //     ko: 'https://www.twidouga.net/ko/realtime_t.php',
    //     ja: 'https://www.twidouga.net/realtime_t.php',
    //   }[language],
    // );

    // await new Promise((r) => setTimeout(r, 30 * 1000));

    await page.goto('https://bot.sannysoft.com/');

    // const [videos, date] = await this.parseTwidougaPage(page);

    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 50,
      encoding: 'base64',
    });

    // await page.close();

    return screenshot;
    // return { videos, date, screenshot };
  }

  private async autoScroll(page: Page) {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        let count = 0;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight - window.innerHeight) {
            count++;
            if (count >= 50) {
              clearInterval(timer);
              resolve();
            }
          } else {
            count = 0;
          }
        }, 100);
      });
    });
  }

  private async parseTwidougaPage(page: Page): Promise<[Video[], Date]> {
    const date = new Date();

    await this.autoScroll(page);

    const videoList = await page.$$('div#container > div.item:not(#pakuri)');

    const videos = await Promise.all(
      videoList.map(async (video, index) => {
        const videoThumbnail = await video
          .$('img')
          .then((img) => img?.getProperty('src'))
          .then((src) => src?.jsonValue());
        const videoUrl = await video
          .$('a')
          .then((a) => a?.getProperty('href'))
          .then((href) => href?.jsonValue())
          .then((href) => href?.split('?')[0]);

        if (videoThumbnail === undefined || videoUrl === undefined) return;

        return {
          index,
          videoThumbnail,
          videoUrl,
        };
      }),
    ).then((videos) =>
      videos.filter((video): video is Video => video !== undefined),
    );

    return [videos, date];
  }
}
