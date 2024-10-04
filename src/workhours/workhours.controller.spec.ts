import { Test, TestingModule } from '@nestjs/testing';
import { WorkhoursController } from './workhours.controller';

describe('WorkhoursController', () => {
  let controller: WorkhoursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkhoursController],
    }).compile();

    controller = module.get<WorkhoursController>(WorkhoursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
