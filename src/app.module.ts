import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatModule } from './feature/cat/cat.module';
import {  UserModule } from './feature/user/user.module';
import { PostModule } from './feature/post/post.module';
import { UploadModule } from './feature/upload/upload.module';
import { TilesMoudle } from './feature/mbtiles/index.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "postgres",
      "host": "localhost",
      "port": 5432,
      "username": "postgres",
      "password": "123456",
      "database": "mbgis",
      "entities": ["dist/**/*.entity.js"],
      "synchronize": true,
      "logging": true
    }),
    CatModule,
    PostModule,
    UserModule,
    UploadModule,
    TilesMoudle
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

