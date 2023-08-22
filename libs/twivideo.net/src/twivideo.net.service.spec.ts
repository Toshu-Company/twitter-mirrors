import { Test, TestingModule } from '@nestjs/testing';
import { TwivideoNetService } from './twivideo.net.service';

describe('TwivideoNetService', () => {
  let service: TwivideoNetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwivideoNetService],
    }).compile();

    service = module.get<TwivideoNetService>(TwivideoNetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
