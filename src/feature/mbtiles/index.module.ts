import { Module } from '@nestjs/common';
import {MbtilesDBModule} from './tilesDB/tiles.module';
import {MbtilesSVModule} from './tilesSV/tiles.module';

@Module({
  imports: [
    MbtilesDBModule,
    MbtilesSVModule
  ],
  controllers: [],
  providers: [],
})
export class TilesMoudle {
}

