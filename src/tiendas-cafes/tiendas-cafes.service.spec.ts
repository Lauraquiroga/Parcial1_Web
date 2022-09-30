/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CafeEntity } from '../cafe/cafe.entity';
import { Repository } from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TiendaCafeService } from './tiendas-cafes.service';

describe('TiendaCafeService', () => {
  let service: TiendaCafeService;
  let tiendaRepository: Repository<TiendaEntity>;
  let cafeRepository: Repository<CafeEntity>;
  let tienda: TiendaEntity;
  let cafesList : CafeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaCafeService],
    }).compile();

    service = module.get<TiendaCafeService>(TiendaCafeService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    cafeRepository = module.get<Repository<CafeEntity>>(getRepositoryToken(CafeEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    cafeRepository.clear();
    tiendaRepository.clear();

    cafesList = [];
    for(let i = 0; i < 5; i++){
        const cafe: CafeEntity = await cafeRepository.save({
          nombre: faker.lorem.word(),
          descripcion: faker.lorem.sentence(),
          precio: faker.datatype.number({'min': 1, 'max':10})
        })
        cafesList.push(cafe);
    }

    tienda = await tiendaRepository.save({
      nombre: faker.lorem.word(),
      direccion: faker.lorem.sentence(),
      telefono: faker.lorem.word(10),
      cafes: cafesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCafeTienda debe agregar un cafe a un tienda', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.sentence(),
        precio: faker.datatype.number({'min': 1, 'max':10}) 
    });

    const newTienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.lorem.word(),
        direccion: faker.lorem.sentence(),
        telefono: faker.lorem.word(10)
    })

    const result: TiendaEntity = await service.addCafeTienda(newTienda.id, newCafe.id);
    
    expect(result.cafes.length).toBe(1);
    expect(result.cafes[0]).not.toBeNull();
    expect(result.cafes[0].nombre).toBe(newCafe.nombre)
    expect(result.cafes[0].precio).toBe(newCafe.precio)
    expect(result.cafes[0].descripcion).toBe(newCafe.descripcion)
  });

  it('addCafeTienda debe arrojar una excepcion para un cafe invalido', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.lorem.word(),
      direccion: faker.lorem.sentence(),
      telefono: faker.lorem.word(10)
    })

    await expect(() => service.addCafeTienda(newTienda.id, "0")).rejects.toHaveProperty("message", "El cafe con el id dado no fue encontrado");
  });

  it('addCafeTienda debe arrojar una excepcion para un tienda invalido', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.lorem.word(),
        descripcion: faker.lorem.sentence(),
        precio: faker.datatype.number({'min': 1, 'max':10}) 
    });

    await expect(() => service.addCafeTienda("0", newCafe.id)).rejects.toHaveProperty("message", "La tienda con el id dado no fue encontrada");
  });


})