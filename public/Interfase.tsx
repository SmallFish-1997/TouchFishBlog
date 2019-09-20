// ----------公用接口类-------------
import {ChangeEvent,MouseEvent} from 'react';


// 接口默认返回接口
export interface NormalRes{
  code: number, 
  msg: string, 
  list?:any[],
  data?:any,
  errMsg?:any,
  [propName: string]: any;
}
// 账号信息
export interface IUserInfo{
  account:string,
  createTime:string,
  Permission:string,
}
// 文章详情 detail
export interface IArticleDetail{
  content: string,
  title: string,
  _id: string,
  articleText:string,
  CreateDate: string,
  categorys:string[],
  views:number, //阅读量
  coverImage?:string, //封面图片
}
// 文章详情response
export interface IArticleRes {
  code: number, // 接口返回状态码
  detail:IArticleDetail, //文章详情内容
  msg: string, //提示信息
  errMsg?: any //报错信息
}
export type IChange = ChangeEvent<HTMLInputElement>;//onChange
export type IClick = MouseEvent;//click


