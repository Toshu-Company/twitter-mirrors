import { Test, TestingModule } from '@nestjs/testing';
import { TwiVideosNetService } from './twi-videos.net.service';

describe('TwiVideosNetService', () => {
  let service: TwiVideosNetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwiVideosNetService],
    }).compile();

    service = module.get<TwiVideosNetService>(TwiVideosNetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
