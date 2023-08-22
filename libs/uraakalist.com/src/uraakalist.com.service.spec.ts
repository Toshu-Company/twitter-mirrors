import { Test, TestingModule } from '@nestjs/testing';
import { UraakalistComService } from './uraakalist.com.service';

describe('UraakalistComService', () => {
  let service: UraakalistComService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UraakalistComService],
    }).compile();

    service = module.get<UraakalistComService>(UraakalistComService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
