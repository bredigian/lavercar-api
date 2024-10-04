import { Test, TestingModule } from '@nestjs/testing';
import { WorkhoursService } from './workhours.service';

describe('WorkhoursService', () => {
  let service: WorkhoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkhoursService],
    }).compile();

    service = module.get<WorkhoursService>(WorkhoursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
