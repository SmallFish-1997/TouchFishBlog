![](https://user-gold-cdn.xitu.io/2019/6/27/16b971908320d8a1?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1)


## Directory

```
——————
  | -- assets               // less样式
  | -- components            // React UI 组件
  | -- utils                 // 公用工具类
      | -- request.tsx      	 
  | -- pages                 // Next.js 页面
  | -- server                // 后端Node接口代码
      | -- controllers       // 控制器 - 业务代码 
      | -- router     	     // 路由 - 路径信息
      | -- service.js 
  | -- static                // 静态资源
  | -- public                // 公用方法、数据、接口
      | -- interfase.tsx     // 公用typescript接口
  | -- .babelrc
  | -- .gitignore
  | -- next.config.js        // Next.js config file
  | -- pm2.config.js         // pm2线上部署
  | -- package.json
  | -- server.js             // server file
  | ...                      // other files
```

## Client - Running Localhost Server

#### development

```
 1. yarn install
 2. npm start
```

> The application is ready on http://localhost:8080



## Server - Running Localhost Server

```
 1. cd ./server
 2. yarn install
 3. npm run service
```

> The application is ready on http://localhost:9090


## MongoDB - 表结构

```
 1. ArticleList // 文章列表
 2. ArticleCategory //文章分类
 3. counters //辅助实现自增id
 4. UserList //用户注册信息
 3. Statistics //网站统计信息
```

## Running Production

> * `npm run winprod`执行pm2.config.js文件，如果未安装pm2则需要全局安装：
> * `npm i -g pm2`

```
 1. npm run build
 2. npm run winprod
```