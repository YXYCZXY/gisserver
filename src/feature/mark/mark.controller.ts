import { Body, Controller, Delete, Get, Inject, Param, Post, Put,Query,Req } from '@nestjs/common';

import { Result } from '../../common/interfaces/result.interface';
import { Mark } from './mark.entity';
import { MarkService } from './mark.service';
import { Request } from 'express';

@Controller('mark')
export class MarkController {
    constructor(
        @Inject(MarkService) private readonly markService: MarkService,
    ) { }

    @Get('init')
    async createInitMark(): Promise<Result> {
        await this.markService.createInitMark();
        return { code: 200, message: '创建成功' };
    }

    @Post()
    async createMark(@Body() mark: Mark): Promise<Result> {
        await this.markService.createMark(mark);
        return { code: 200, message: '创建成功' };
    }

    @Delete(':id')
    async deleteMark(@Param('id') id: number): Promise<Result> {
        await this.markService.deleteMark(id);
        return { code: 200, message: '删除成功' };
    }

    @Put(':id')
    async updateMark(@Param('id') id: number, @Body() mark: Mark): Promise<Result> {
        await this.markService.updateMark(id, mark);
        return { code: 200, message: '更新成功' };
    }

    @Get(':id')
    async findOneMark(@Param('id') id: number): Promise<Result> {
        const data = await this.markService.findOneMark(id);
        return { code: 200, message: '查询成功', data };
    }


    // @Get()
    // async findMarksByConditions(@Query() query: any): Promise<Result> {
    //     const conditions: Partial<Mark> = query; // Assuming your query parameters match Cat entity properties
    //     const data = await this.markService.findConditionsMarks(conditions);
    //     return { code: 200, message: '查询成功', data };
    // }

    @Get() // 使用更具描述性的路由路径
    async findAdminAll(): Promise<Result> {
        const data = await this.markService.findAllMarks();
        return { code: 200, message: '查询所有帖子成功', data };
    }
}