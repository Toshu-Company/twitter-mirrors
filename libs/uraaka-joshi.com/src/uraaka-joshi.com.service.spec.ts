import { Test, TestingModule } from '@nestjs/testing';
import { UraakaJoshiComService } from './uraaka-joshi.com.service';

describe('UraakaJoshiComService', () => {
  let service: UraakaJoshiComService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UraakaJoshiComService],
    }).compile();

    service = module.get<UraakaJoshiComService>(UraakaJoshiComService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
