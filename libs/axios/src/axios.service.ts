import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SocksProxyAgent } from 'socks-proxy-agent';

@Injectable()
export class AxiosService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: 5000,
      maxRedirects: 5,
      // httpAgent: new SocksProxyAgent('socks5h://warproxy:1080'),
      // httpsAgent: new SocksProxyAgent('socks5h://warproxy:1080'),
    };
  }
}
