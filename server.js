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
app.prepare()
  .then(() => {
    const server = express();
    server.get('*', (req, res) => {
      return handle(req, res);
    });
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

