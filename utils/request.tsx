import Axios from 'axios'
Axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

import { NormalRes } from '@public/Interfase'

// 请求工具类

// 定义接口
// 方式1：
// const Default_Req = {
//   url:'',
//   body:{}
// }
// type _Req = typeof Default_Req;

// 方式二：
interface _Req {
  url: string,
  body?: any,
}
interface _Request extends _Req {
  method: any
}
interface IResponse{
  data:NormalRes,
  [propName: string]: any;
}

export default class RequestUtil {
  // static Host = `http://106.53.88.252:9090`;
  
  static Host = process.env.HOST_URL?process.env.HOST_URL:`http://127.0.0.1:9090`;
  static async sendPost({ url, body }: _Req): Promise<NormalRes> {
    return await this.send_Request({
      url,
      body,
      method: 'POST',
    })
  }
  static async sendGet({ url, body }: _Req): Promise<NormalRes> {
    return await this.send_Request({
      url,
      body,
      method: 'GET',
    })
  }
  static send_Request({ url, method, body }: _Request): Promise<NormalRes> {
    return new Promise((resolve, reject) => {
      Axios({
        url: this.Host+url,
        data:body,
        method: method
      }).then(function (res: IResponse): void {
        resolve(res.data);
      }).catch(function (err: any): void {
        reject(err);
      })
    })
  }
}



