import { Test, TestingModule } from '@nestjs/testing';
import { ItracksafeController } from './itracksafe.controller';
import { ItracksafeService } from './itracksafe.service';

describe('ItracksafeController', () => {
  let controller: ItracksafeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItracksafeController],
      providers: [ItracksafeService],
    }).compile();

    controller = module.get<ItracksafeController>(ItracksafeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
