/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CafeEntity } from '../cafe/cafe.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class TiendaCafeService {
    constructor(
        @InjectRepository(CafeEntity)
        private readonly cafeRepository: Repository<CafeEntity>,
     
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ) {}

    async addCafeTienda(tiendaId: string, cafeId: string): Promise<TiendaEntity> {
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id: cafeId}});
        if (!cafe)
          throw new BusinessLogicException("El cafe con el id dado no fue encontrado", BusinessError.NOT_FOUND);
       
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["cafes"]}) 
        if (!tienda)
          throw new BusinessLogicException("La tienda con el id dado no fue encontrada", BusinessError.NOT_FOUND);
     
        tienda.cafes = [...tienda.cafes, cafe];
        return await this.tiendaRepository.save(tienda);
      }
     

}