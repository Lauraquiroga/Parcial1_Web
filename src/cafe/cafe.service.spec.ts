/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CafeEntity } from './cafe.entity';
import { CafeService } from './cafe.service';

import { faker } from '@faker-js/faker';

describe('CafeService', () => {
  let service: CafeService;
  let repository: Repository<CafeEntity>;
  let cafesList: CafeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CafeService],
    }).compile();

    service = module.get<CafeService>(CafeService);
    repository = module.get<Repository<CafeEntity>>(getRepositoryToken(CafeEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    cafesList = [];
    for(let i = 0; i < 5; i++){
      const cafe: CafeEntity = await repository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.sentence(),
        precio: faker.datatype.number({'min': 1, 'max':10})

      })
      cafesList.push(cafe);
    }
  }

  

  it('create debe devolver una cafe nueva', async () => {
    const cafe: CafeEntity = {
      id: "",
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      precio: faker.datatype.number({'min': 1, 'max':10}),
      tiendas: []
    }
 
    const newCafe: CafeEntity = await service.create(cafe);
    expect(newCafe).not.toBeNull();
 
    const storedCafe: CafeEntity = await repository.findOne({where: {id: newCafe.id}})
    expect(newCafe).not.toBeNull();
    expect(newCafe.nombre).toEqual(storedCafe.nombre)
    expect(newCafe.descripcion).toEqual(storedCafe.descripcion)
    expect(newCafe.precio).toEqual(storedCafe.precio)
  });

  it('create debe arrojar una excepcion al intentar crear un cafe con un precio negativo', async () => {
    const cafe: CafeEntity = {
      id: "",
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      precio: faker.datatype.number({'min': -10, 'max':-1}),
      tiendas: []
    }
 
    await expect(() => service.create(cafe)).rejects.toHaveProperty("message", "Precio negativo es invalido")
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});