import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MarkController } from './mark.controller';
//实体
import { Mark } from './mark.entity';
//服务
import { MarkService } from './mark.service';

@Module({
    imports: [TypeOrmModule.forFeature([Mark])],
    controllers: [MarkController],
    providers: [MarkService],
})
export class MarkModule { }