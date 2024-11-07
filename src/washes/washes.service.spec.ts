import { Test, TestingModule } from '@nestjs/testing';
import { WashesService } from './washes.service';

describe('WashesService', () => {
  let service: WashesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WashesService],
    }).compile();

    service = module.get<WashesService>(WashesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
