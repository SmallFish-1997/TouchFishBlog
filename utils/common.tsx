/**
 * @name 公用方法 
 * */
import RequestUtil from '@utils/request';
import { IUserInfo } from '@public/Interfase'

 export default class CommonFn{
     static getLocalData(key:string){
        let Info = localStorage.getItem(key);
        if(!Info || Info === null || JSON.parse(Info)==='{}'){
            return null;
        }
        return JSON.parse(Info);
     }
     static async CheckAccount():Promise<IUserInfo|null>{
        const UserInfo = this.getLocalData('FishInfomation');
        if(!UserInfo || !UserInfo.account){
            window.location.href = '/';
            return null;
        }
        const permissionRes = await RequestUtil.sendPost({
            url: `/login/permission`,
            body:{
                account:UserInfo.account
            }
        })
        if(permissionRes.code !== 0){
            window.location.href = '/';
            return null;
        }
        return UserInfo;
     }
 
 }