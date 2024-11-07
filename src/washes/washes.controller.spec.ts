import { Test, TestingModule } from '@nestjs/testing';
import { WashesController } from './washes.controller';

describe('WashesController', () => {
  let controller: WashesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WashesController],
    }).compile();

    controller = module.get<WashesController>(WashesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
