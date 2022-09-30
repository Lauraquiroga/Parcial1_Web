import { Test, TestingModule } from '@nestjs/testing';
import { TiendasCafesService } from './tiendas-cafes.service';

describe('TiendasCafesService', () => {
  let service: TiendasCafesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiendasCafesService],
    }).compile();

    service = module.get<TiendasCafesService>(TiendasCafesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
