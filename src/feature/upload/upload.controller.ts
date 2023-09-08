import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Get, Param, Res,Req,Query,Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { extname, join } from 'path';
import { Result } from '../../common/interfaces/result.interface';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any): Promise<string> {
    const account = req.body.account; // 从身份验证中获取用户账号
    const fileName = await this.uploadService.saveFile(file, account);
    return fileName;
  }


  @Get('file/account')
  async getAllFileName(@Query('account') account: string): Promise<any[]> {
    const filePath = join(__dirname, '../../../../uploads/', 'common', account);
    const fileNames = await this.uploadService.getAllFile(filePath);
    return fileNames;
  }

  @Get('file/fileName')
  async getFile(@Query() query): Promise<any[]> {
    const filePath = join(__dirname, '../../../../uploads/', 'common', query.account,query.name);
    const fileNames = await this.uploadService.getFile(filePath);
    return fileNames;
  }

  @Delete('file/delete')
  async deleteFile(@Query() query): Promise<any[]> {
    const filePath = join(__dirname, '../../../../uploads/', 'common', query.account,query.name);
    const fileNames = await this.uploadService.delete(filePath);
    return fileNames;
  }
}
