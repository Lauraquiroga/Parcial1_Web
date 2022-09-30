/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';

import { faker } from '@faker-js/faker';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for(let i = 0; i < 5; i++){
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.lorem.word(),
        direccion: faker.lorem.sentence(),
        telefono: faker.lorem.word(10)
      })
      tiendasList.push(tienda);
    }
  }


  it('create debe devolver una tienda nueva', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.lorem.word(),
      direccion: faker.lorem.sentence(),
      telefono: faker.lorem.word(10),
      cafes: []
    }
 
    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();
 
    const storedTienda: TiendaEntity = await repository.findOne({where: {id: newTienda.id}})
    expect(newTienda).not.toBeNull();
    expect(newTienda.nombre).toEqual(storedTienda.nombre)
    expect(newTienda.direccion).toEqual(storedTienda.direccion)
    expect(newTienda.telefono).toEqual(storedTienda.telefono)
  });

  it('create debe arrojar una excepcion al intentar crear una tienda con telefono de numero de digitos diferente a 10', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.lorem.word(),
      direccion: faker.lorem.sentence(),
      telefono: faker.lorem.word(11),
      cafes: []
    }
 
    await expect(() => service.create(tienda)).rejects.toHaveProperty("message", "Telefono invalido")
  });
  

});