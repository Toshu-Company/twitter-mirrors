import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TwivideoService {
  async mirror(url: string) {
    return axios
      .get(url, {
        headers: {
          Referer: 'https://twivideo.net/',
        },
      })
      .then((res) => res.request.res.responseUrl);
  }
}
