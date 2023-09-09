import { Test, TestingModule } from '@nestjs/testing';
import { YatvNetService } from './yatv.net.service';

describe('YatvNetService', () => {
  let service: YatvNetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YatvNetService],
    }).compile();

    service = module.get<YatvNetService>(YatvNetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
