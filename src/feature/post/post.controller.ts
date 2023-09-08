import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { Roles } from '../../common/decorators/roles.decorator';
import { Result } from '../../common/interfaces/result.interface';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Post as PostEntity } from './post.entity';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(
        @Inject(PostService) private readonly postService: PostService
    ) { }

    @Post()
    @UseGuards(AuthGuard())
    async createPost(@Req() req: Request, @Body() createInput: PostEntity): Promise<Result> {
        createInput.user = req.body.user;
        await this.postService.create(createInput);
        return { code: 200, message: '创建帖子成功' };
    }



    @Delete(':id')
    // @Roles('admin')
    @UseGuards(AuthGuard(), RolesGuard)
    async remove(@Param('id') id: number): Promise<Result> {
        await this.postService.remove(id);
        return { code: 200, message: '删除帖子成功' };
    }


    @Put(':id')
    // @Roles('admin')
    @UseGuards(AuthGuard(), RolesGuard)
    async update(@Param('id') id: number, @Body() updateInput: PostEntity): Promise<Result> {
        await this.postService.update(id, updateInput);
        return { code: 200, message: '更新帖子成功' };
    }

    // {
    //     "userId":4
    // }
    @Get()
    @UseGuards(AuthGuard())
    async findAll(@Req() req: Request): Promise<Result> {
        console.log(req.body)
        const data = await this.postService.findAll(req.body.userId);
        return { code: 200, message: '查询所有帖子成功', data };
    }


    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Result> {
        const data = await this.postService.findOneById(id);
        return { code: 200, message: '查询帖子成功', data };
    }

    @Get('all')
    @Roles('admin')
    @UseGuards(AuthGuard())
    async findAdminAll(@Req() req: Request): Promise<Result> {
        const data = await this.postService.findAdminAll();
        return { code: 200, message: '查询所有帖子成功', data };
    }

    @Delete(':id')
    @Roles('admin')
    @UseGuards(AuthGuard(), RolesGuard)
    async Adminremove(@Param('id') id: number): Promise<Result> {
        await this.postService.remove(id);
        return { code: 200, message: '删除帖子成功' };
    }
}