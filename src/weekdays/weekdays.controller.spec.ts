import { Test, TestingModule } from '@nestjs/testing';
import { WeekdaysController } from './weekdays.controller';

describe('WeekdaysController', () => {
  let controller: WeekdaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeekdaysController],
    }).compile();

    controller = module.get<WeekdaysController>(WeekdaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
