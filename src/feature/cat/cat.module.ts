import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CatController } from './cat.controller';
//实体
import { Cat } from './cat.entity';
//服务
import { CatService } from './cat.service';

@Module({
    imports: [TypeOrmModule.forFeature([Cat])],
    controllers: [CatController],
    providers: [CatService],
})
export class CatModule { }