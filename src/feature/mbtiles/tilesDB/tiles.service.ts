import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import {filesize} from "filesize"
const { execSync } = require('child_process');
import { promisify } from 'util';
import { unlink } from 'fs';

@Injectable()
export class MbtilesService {
  async saveFile(file: Express.Multer.File, fileName: string): Promise<string> {
    const uploads = path.join(__dirname, '../../../../', 'uploads')
    if (!fs.existsSync(uploads)) {
      fs.mkdirSync(uploads);
    }

    const common = path.join(__dirname, '../../../../uploads/', 'mbtiles')
    if (!fs.existsSync(common)) {
      fs.mkdirSync(common);
    }

    // 检查是否有以用户ID命名的文件夹，如果没有则创建
    const userFolder = path.join(__dirname, '../../../../uploads/', 'mbtiles', fileName);
    console.log(fs.existsSync(userFolder))
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder);
    }


    //将geojson转换
    // 将文件保存到用户文件夹中
    const filePath = path.join(userFolder, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    let outMbtiles = file.originalname.replace("geojson", "mbtiles")
      // 在这里运行 Docker 命令
      const dockerCommand = `docker run --rm  -v ${userFolder}:/data_tiles ingmapping/tippecanoe -s "urn:ogc:def:crs:EPSG::3857"  -o data_tiles/${outMbtiles} /data_tiles/${file.originalname}`
      console.log(dockerCommand)
      try {
        execSync(dockerCommand);
        console.log('Docker command executed successfully.');
        this.delete(filePath)
      } catch (error) {
        console.error('Error executing Docker command:', error.message);
      }
    return file.originalname;
  }



  async getAllFile(directoryPath: string): Promise<any[]> {
    // 检查文件是否存在
    if (!fs.existsSync(directoryPath)) {
      throw new NotFoundException('File not found');
    }

    try {
      const files = await fs.promises.readdir(directoryPath);
      const fileDetails = await Promise.all(files.map(async (fileName) => {
        const filePath = path.join(directoryPath, fileName);
        const stats = await fs.promises.stat(filePath);
        const fileExtension = path.extname(fileName).toLowerCase()
        const mimeType = fileExtension.replace(".", "")
        const formattedSize = filesize(stats.size);

        return {
          name: fileName,
          type: mimeType,
          size: formattedSize
          // You can add more properties here if needed
        };
      }));

      return fileDetails;
    } catch (error) {
      throw new Error(`Error listing files in directory: ${error.message}`);
    }
  }

  async delete(filePath: string): Promise<string[]> {
    const unlinkAsync = promisify(unlink); // 使用 promisify 包装 unlink 方法，以支持异步操作

    try {
      await unlinkAsync(filePath); // 删除文件
      return [filePath]; // 返回被删除的文件路径
    } catch (error) {
      throw new Error(`无法删除文件：${error.message}`);
    }
  }

  getFile(filePath: string): any {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    // 返回文件流
    return fs.createReadStream(filePath);
  }
}
