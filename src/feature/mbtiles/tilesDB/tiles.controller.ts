import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Get, Param, Res,Req,Query,Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { MbtilesService } from './tiles.service';
import { extname, join } from 'path';

@Controller('mbtiles')
export class MbtilesController {
  constructor(private readonly mbtilesService: MbtilesService) {}
  
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any): Promise<string> {
    let account = null
    if(!req.cookies.account){
      account = '245174862'
    } else {
      account = req.cookies.account
    }
    const fileName = await this.mbtilesService.saveFile(file, account);
    return fileName;
  }


  @Get('file/account')
  async getAllFileName(@Req() req: any): Promise<any[]> {
    let account = null
    if(!req.cookies.account){
      account = '245174862'
    } else {
      account = req.cookies.account
    }
    const filePath = join(__dirname, '../../../../uploads/', 'mbtiles', account);
    const fileNames = await this.mbtilesService.getAllFile(filePath);
    return fileNames;
  }

  @Get('file/:fileName')
  async getFile(@Param('fileName') fileName: string,@Req() req: any): Promise<any[]> {
    let account = null
    if(!req.cookies.account){
      account = '245174862'
    } else {
      account = req.cookies.account
    }
    const filePath = join(__dirname, '../../../../uploads/', 'mbtiles', account,fileName);
    const fileNames = await this.mbtilesService.getFile(filePath);
    return fileNames;
  }

  @Delete('file/delete')
  async deleteFile(@Query() query): Promise<any[]> {
    const filePath = join(__dirname, '../../../../uploads/', 'mbtiles', query.account,query.name);
    const fileNames = await this.mbtilesService.delete(filePath);
    return fileNames;
  }
}
