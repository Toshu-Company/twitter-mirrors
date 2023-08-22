import { Test, TestingModule } from '@nestjs/testing';
import { TwidougaNetService } from './twidouga.net.service';

describe('TwidougaNetService', () => {
  let service: TwidougaNetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwidougaNetService],
    }).compile();

    service = module.get<TwidougaNetService>(TwidougaNetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
