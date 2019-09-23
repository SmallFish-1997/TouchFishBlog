const express = require('express');
const cp = require('child_process');
const next = require('next');
const path = require('path');
const { publicRuntimeConfig, serverRuntimeConfig } = require('./next.config.js');

const { isDev } = publicRuntimeConfig;
const { PORT } = serverRuntimeConfig;

// 判断开发环境和生产环境
const dev = isDev;
const app = next({ dev });
const handle = app.getRequestHandler();
const routers = require('./server/router')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
app.prepare()
  .then(() => {
    const server = express();
    server.get('*', (req, res) => {
      return handle(req, res);
    });
    server.all("*", function (req, res, next) {
      //设置允许跨域的域名，*代表允许任意域名跨域
      res.header("Access-Control-Allow-Origin", "*");
      //允许的header类型
      res.header("Access-Control-Allow-Headers", "content-type");
      //跨域允许的请求方式
      res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
      if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
      else
        next();
    });
    server.use(cookieParser());
    server.use(bodyParser.json());  //body-parser 解析json格式数据
    server.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
      extended: false
    }));
    server.use(routers);

    server.listen(PORT, err => {
      if (err) throw err;
      const serverUrl = `http://localhost:${PORT}`;
      console.log(`Client Running on http://localhost:${PORT}`);
      // console.log(`> Ready on ${serverUrl}`);
      // 开发环境自动启动游览器
      if (dev) {
        // switch (process.platform) {
        //   //mac系统使用 一下命令打开url在浏览器
        //   case 'darwin':
        //     cp.exec(`open ${serverUrl}`);
        //     break;
        //   //win系统使用 一下命令打开url在浏览器
        //   case 'win32':
        //     cp.exec(`start ${serverUrl}`);
        //     break;
        //   // 默认mac系统
        //   default:
        //     cp.exec(`open ${serverUrl}`);
        // }
      }
    });
  });

