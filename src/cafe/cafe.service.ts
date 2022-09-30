/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CafeEntity } from './cafe.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CafeService {

    constructor(
        @InjectRepository(CafeEntity)
        private readonly cafeRepository: Repository<CafeEntity>
    ){}

   
    //Create
    async create(cafe: CafeEntity): Promise<CafeEntity> {

        //validacion de que el precio sea positivo
        if(cafe.precio<0)
            throw new BusinessLogicException("Precio negativo es invalido", BusinessError.PRECONDITION_FAILED);

            
        return await this.cafeRepository.save(cafe);
    }

   

}