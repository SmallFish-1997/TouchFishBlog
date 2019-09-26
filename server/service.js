const express = require('express');
const path = require('path');
const routers = require('./router')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const PORT = `9090`;

const server = express();
server.use(cookieParser());
server.use(bodyParser.json());  //body-parser 解析json格式数据
server.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: false
}));
// server.all("*", function (req, res, next) {
//   //设置允许跨域的域名，*代表允许任意域名跨域
//   res.header("Access-Control-Allow-Origin", "*");
//   //允许的header类型
//   res.header("Access-Control-Allow-Headers", "content-type");
//   //跨域允许的请求方式
//   res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
//   if (req.method.toLowerCase() == 'options')
//     res.send(200);  //让options尝试请求快速结束
//   else
//     next();
// });
server.use(routers);

server.listen(PORT, err => {
  if (err) throw err;
  console.log(`Server Running on http://localhost:${PORT}`);
});

