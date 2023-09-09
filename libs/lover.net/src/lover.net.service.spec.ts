import { Test, TestingModule } from '@nestjs/testing';
import { LoverNetService } from './lover.net.service';

describe('LoverNetService', () => {
  let service: LoverNetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoverNetService],
    }).compile();

    service = module.get<LoverNetService>(LoverNetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
