import { Test, TestingModule } from '@nestjs/testing';
import { ItracksafeService } from './itracksafe.service';

describe('ItracksafeService', () => {
  let service: ItracksafeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItracksafeService],
    }).compile();

    service = module.get<ItracksafeService>(ItracksafeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
