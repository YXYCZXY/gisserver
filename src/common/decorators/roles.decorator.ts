import { SetMetadata } from '@nestjs/common';

//SetMetadata 是 NestJS 框架提供的一个函数，用于设置元数据。
//在这里，它用于将角色信息与目标路由处理器或控制器方法关联起来。
//这段代码的作用是让你能够在 NestJS 的路由处理器或控制器方法上标记所需的角色要求。
//在处理请求时，你可以使用这些装饰器来验证用户是否具有执行特定操作的权限。
//例如，你可以编写中间件或守卫，检查用户的角色是否与路由处理器上标记的角色匹配。
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);