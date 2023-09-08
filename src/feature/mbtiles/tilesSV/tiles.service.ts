import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import {filesize} from "filesize"
const { execSync } = require('child_process');
import { promisify } from 'util';
import { unlink } from 'fs';
import * as consolidate from 'consolidate';
const MBTiles = require('@mapbox/mbtiles')

@Injectable()
export class MbtilesService {

  async getAllList(directoryPath: string): Promise<string[]> {
    // 检查文件是否存在
    if (!fs.existsSync(directoryPath)) {
      throw new NotFoundException('File not found');
    }

    try {
      const tilesetsDir = path.resolve(directoryPath)

      const files = fs.readdirSync(tilesetsDir);
      const tilesets = files
        .filter(file => path.extname(file) === '.mbtiles')
        .map(file => path.parse(file).name);
      return tilesets;

    } catch (error) {
      throw new Error(`Error listing files in directory: ${error.message}`);
    }
  }

  async getTilejson(filePath:string,tilesetId: string, req: any,) {
    const tilesetsDir = path.resolve(filePath);
    const source = `mbtiles://${tilesetsDir}/${tilesetId}.mbtiles?mode=ro`;

    return new Promise((resolve, reject) => {
      new MBTiles(source, async (err, source) => {
        if (err) reject(err);

        source.getInfo(async (err, info) => {
          source.close();
          if (err) reject(err);

          const apiBaseUrl = `${req.protocol}://${req.headers.host}`;
          info.tiles = info.tiles || [`${apiBaseUrl}/tilesets/${tilesetId}/{z}/{x}/{y}.${info.format}`];
          info.type = ['pbf', 'mvt'].includes(info.format) ? 'vector' : 'raster';

          resolve(info);
        });
      });
    });
  }

  async getTile(filePath:string,tilesetId: string, z: number, x: number, y: number): Promise<{ data: Buffer, headers: Record<string, string> }> {
    const tilesetsDir = path.resolve(filePath);
    const source = `mbtiles://${tilesetsDir}/${tilesetId}.mbtiles?mode=ro`;

    return new Promise<{ data: Buffer, headers: Record<string, string> }>((resolve, reject) => {
      new MBTiles(source, (err, source) => {
        if (err) return reject(err);

        source.getTile(z, x, y, (err, data, headers) => {
          source.close();
          if (err && err.message.match(/(Tile|Grid) does not exist/)) {
            return reject(new NotFoundException('Tile not found'));
          }
          if (err) return reject(err);
          if (!data) return resolve({ data: Buffer.from(''), headers });

          delete headers['ETag'];
          resolve({ data, headers });
        });
      });
    });
  }

  async renderHtml(tilesetId: string): Promise<string> {
    const templatePath = path.join(__dirname, './template.html');
    
    return new Promise((resolve, reject) => {
      consolidate.ejs(templatePath, { tilesetId }, (err, html) => {
        if (err) return reject(err);
  
        resolve(html);
      });
    });
  }
}
