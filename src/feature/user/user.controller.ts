import { Body, Controller, Delete,Res, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../common/decorators/roles.decorator';
import { Result } from '../../common/interfaces/result.interface';
import { AuthService } from '../../core/auth/auth.service';
import { RolesGuard } from '../../core/guards/roles.guard';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
        @Inject(UserService) private readonly userService: UserService
    ) { }

    /**
     * 用户登录成功后，返回的 data 是授权令牌；
     * 在调用有 @UseGuards(AuthGuard()) 装饰的路由时，会检查当前请求头中是否包含 Authorization: Bearer xxx 授权令牌，
     * 其中 Authorization 是用于告诉服务端本次请求有令牌，并且令牌前缀是 Bearer，而令牌的具体内容是登录之后返回的 data(accessToken)。
     */
    @Post('login')
    async login(@Body() body: { account: string, password: string },@Res({ passthrough: true }) res: Response,): Promise<Result> {
        await this.userService.login(body.account, body.password);
        const accessToken = await this.authService.createToken({ account: body.account });
        res.cookie('account', body.account, {maxAge: 1000*60*10, httpOnly: true});
        return { code: 200, message: '登录成功', data: accessToken };
    }

    @Post('register')
    async register(@Body() user: User): Promise<Result> {
        await this.userService.register(user);
        return { code: 200, message: '注册成功' };
    }

    @Delete(':id')
    @Roles('admin')// 使用 @Roles 装饰器标记需要 "admin" 角色才能访问的路由
    @UseGuards(AuthGuard(), RolesGuard)//使用 @UseGuards 添加认证守卫，确保用户已认证并具有所需角色
    async remove(@Param('id') id: number): Promise<Result> {
        await this.userService.remove(id);
        return { code: 200, message: '删除用户成功' };
    }

    @Put(':id')
    @Roles('admin')
    @UseGuards(AuthGuard(), RolesGuard)
    async update(@Param('id') id: number, updateInput: User): Promise<Result> {
        await this.userService.update(id, updateInput);
        return { code: 200, message: '更新用户成功' };
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Result> {
        const data = await this.userService.findOneWithPostsById(id);
        return { code: 200, message: '查询用户成功', data };
    }

    @Get()
    @Roles('admin')
    @UseGuards(AuthGuard(), RolesGuard)
    async findAll(): Promise<Result> {
        const data = await this.userService.findAll();
        return { code: 200, message: '查询所有用户成功', data };
    }
}
