/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {

    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ){}


    //Create
    async create(tienda: TiendaEntity): Promise<TiendaEntity> {

        //validacion de longitud del telefono =10
        if(tienda.telefono.length!=10)
            throw new BusinessLogicException("Telefono invalido", BusinessError.PRECONDITION_FAILED);

        return await this.tiendaRepository.save(tienda);
    }


}