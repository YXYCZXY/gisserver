import { Body, Controller, Delete, Get, Inject, Param, Post, Put,Query } from '@nestjs/common';

import { Result } from '../../common/interfaces/result.interface';
import { Cat } from './cat.entity';
import { CatService } from './cat.service';

@Controller('cat')
export class CatController {
    constructor(
        @Inject(CatService) private readonly catService: CatService,
    ) { }

    @Post()
    async createCat(@Body() cat: Cat): Promise<Result> {
        await this.catService.createCat(cat);
        return { code: 200, message: '创建成功' };
    }

    @Delete(':id')
    async deleteCat(@Param('id') id: number): Promise<Result> {
        await this.catService.deleteCat(id);
        return { code: 200, message: '删除成功' };
    }

    @Put(':id')
    async updateCat(@Param('id') id: number, @Body() cat: Cat): Promise<Result> {
        await this.catService.updateCat(id, cat);
        return { code: 200, message: '更新成功' };
    }

    @Get(':id')
    async findOneCat(@Param('id') id: number): Promise<Result> {
        const data = await this.catService.findOneCat(id);
        return { code: 200, message: '查询成功', data };
    }


    @Get()
    async findCatsByConditions(@Query() query: any): Promise<Result> {
        const conditions: Partial<Cat> = query; // Assuming your query parameters match Cat entity properties
        const data = await this.catService.findConditionsCats(conditions);
        return { code: 200, message: '查询成功', data };
    }
}