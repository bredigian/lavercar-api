import { Test, TestingModule } from '@nestjs/testing';
import { WeekdaysService } from './weekdays.service';

describe('WeekdaysService', () => {
  let service: WeekdaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeekdaysService],
    }).compile();

    service = module.get<WeekdaysService>(WeekdaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
