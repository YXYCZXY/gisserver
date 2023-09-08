
import { MbtilesService } from './tiles.service';
import { MbtilesController } from './tiles.controller';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  providers: [MbtilesService],
  controllers: [MbtilesController],
})
export class MbtilesSVModule {}

