import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Get, Param, Res,Req,Query,Delete,Next,Headers  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Response,Request } from 'express';
import { MbtilesService } from './tiles.service';
import { extname, join } from 'path';

@Controller('tilesets')
export class MbtilesController {
  constructor(private readonly mbtilesService: MbtilesService) {}
  
  @Get('list')
  async getAllList(@Res() res: Response,@Req() req): Promise<void> {
    let account = null
    if(!req.cookies.account){
      account = '245174862'
    } else {
      account = req.cookies.account
    }
    const filePath = join(__dirname, '../../../../uploads/', 'mbtiles', account);
    const fileNames = await this.mbtilesService.getAllList(filePath);
    res.json(fileNames)
  }

  @Get(':tilesetId/tilejson')
  async getTilejson(
    @Param('tilesetId') tilesetId: string,
    @Req() req,
    @Res() res: Response,
    @Next() next,
  ) {
    try {
      let account = null
      if(!req.cookies.account){
        account = '245174862'
      } else {
        account = req.cookies.account
      }
      const filePath = join(__dirname, '../../../../uploads/', 'mbtiles', account);
      const tilejson = await this.mbtilesService.getTilejson(filePath,tilesetId, req);
      res.json(tilejson);
    } catch (err) {
      next(err);
    }
  }

  @Get(':tilesetId/:z/:x/:y.pbf')
  async getTile(
    @Param('tilesetId') tilesetId: string,
    @Param('z') z: number,
    @Param('x') x: number,
    @Param('y') y: number,
    @Res() res: Response,
    @Req() req,
  ) {
    try {
      let account = null
      if(!req.cookies.account){
        account = '245174862'
      } else {
        account = req.cookies.account
      }

      const filePath = join(__dirname, '../../../../uploads/', 'mbtiles', account);
      const { data, headers } = await this.mbtilesService.getTile(filePath,tilesetId,z, x, y);

      if (data.length === 0) {
        res.status(204).end();
      } else {
        res.set(headers).send(data);
      }
    } catch (err) {
      res.status(404).send(err.message);
    }
  }

  @Get(':tilesetId/html')
  async getHTML(@Param('tilesetId') tilesetId: string,@Res() res: Response,){
    try {
      const html = await this.mbtilesService.renderHtml(tilesetId);
      res.send(html);

    } catch (err) {
      res.status(404).send(err.message);
    }
  }


  
}
