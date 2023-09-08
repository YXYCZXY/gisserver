import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as serveIndex from 'serve-index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用跨域支持和使用 cookieParser
  app.enableCors();
  app.use(cookieParser());

  const staticDir = path.join(__dirname, '../uploads');
  const staticPrefix = '/static';

  // 使用 express.static 中间件来提供静态资源
  app.use(staticPrefix, express.static(staticDir));

  // 使用 serve-index 中间件来显示目录列表
  app.use(staticPrefix, serveIndex(staticDir, { icons: true }));

  const port = 3000; // 你可以选择不同的端口
  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
bootstrap();
