# 数据库
1.配置数据库
将csv_1692603138913.csv导入xiaoW数据库中的cat表(没数据库新建)
2.配置
在app.module.ts中

```json
    TypeOrmModule.forRoot({
      "type": "postgres",
      "host": "localhost",
      "port": 5432,//端口
      "username": "postgres",//用户名
      "password": "123456",//密码
      "database": "xiaoW",//数据库名称
      "entities": ["dist/**/*.entity.js"],
      "synchronize": true,
      "logging": true
    }),
```
# 启动

npm install

npm run start

# 使用

1.增

http://localhost:3000/cat post请求

2.删

http://localhost:3000/cat/3 Delete请求

3.查
  1.查询全部
    http://localhost:3000/cat get请求
  2.根据id查询
    http://localhost:3000/cat/3 get请求

4.改

http://localhost:3000/cat/3 put请求
