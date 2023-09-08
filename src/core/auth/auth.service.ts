import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

//用户实体
import { User } from '../../feature/user/user.entity';
//用户服务类
import { UserService } from '../../feature/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UserService) private readonly userService: UserService,
        @Inject(JwtService) private readonly jwtService: JwtService,
    ) { }

    //方法用于生成 JWT 令牌。它接受一个包含账号信息的负载对象，然后使用 jwtService 的 sign 方法来签发 JWT 令牌。
    async createToken(payload: { account: string }): Promise<string> {
        return this.jwtService.sign(payload);
    }

    //方法用于验证用户。它接受一个包含账号信息的负载对象，并通过 userService 的方法来查找与该账号相关的用户实体。
    async validateUser(payload: { account: string }): Promise<User> {
        return await this.userService.findOneByAccount(payload.account);
    }
}