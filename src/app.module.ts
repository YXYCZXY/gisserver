import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatModule } from './feature/cat/cat.module';
import {  UserModule } from './feature/user/user.module';
import { PostModule } from './feature/post/post.module';
import { UploadModule } from './feature/upload/upload.module';
import { TilesMoudle } from './feature/mbtiles/index.module';
import { MarkModule } from './feature/mark/mark.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   "type": "postgres",
    //   "host": "localhost",
    //   "port": 5432,
    //   "username": "postgres",
    //   "password": "123456",
    //   "database": "markdown",
    //   "entities": ["dist/**/*.entity.js"],
    //   "synchronize": true,
    //   "logging": true
    // }),
    TypeOrmModule.forRoot({
      "type": "mysql", // 更改数据库类型为 MySQL
      "host": "sh-cynosdbmysql-grp-j8e7jrku.sql.tencentcdb.com",
      "port": 25990, // MySQL 默认端口是 3306
      "username": "root", // 更改为您的 MySQL 用户名
      "password": "s666666S", // 更改为您的 MySQL 密码
      "database": "gis", // 更改为您的 MySQL 数据库名称
      "entities": ["dist/**/*.entity.js"],
      "synchronize": true,
      "logging": true,
      connectTimeout: 20000, // 增加超时值（毫秒）
      acquireTimeout: 20000, // 增加超时值（毫秒）
    }),
    CatModule,
    PostModule,
    UserModule,
    UploadModule,
    TilesMoudle,
    MarkModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

