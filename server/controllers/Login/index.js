/** 
 * @name 登录注册接口
 * */
const MongodbUtils = require('../../mongodb');
const _MongodbUtils = new MongodbUtils();
const Utils = require('../../public/utils');
const MD5 = require('crypto-js/md5');

const SignIn = async (req, res, next) => {
    let Params = req.body;

    if (!Utils.checkBodyData(Params, ['account', 'password'])) {
        res.json({
            code: -1,
            msg: 'account | password not empty!'
        })
        return;
    }
    let { account, password } = Params;
    let [err, data] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('UserList', { "account": account.toUpperCase() }, { "password": 1, "CreateDate": 1,"Permission":1 }, true));
    if (err) {
        res.json({
            code: -1,
            msg: 'Account Or Password Error!'
        })
        return;
    }
    if (checkPasswordError(data, password)) {
        res.json({
            code: -1,
            msg: 'Login password error'
        })
        return;
    }

    res.json({
        code: 0,
        data:{
            account,
            createTime:data.CreateDate,
            Permission:data.Permission
        },
        msg: 'Sign in success'
    })
}
const SignUp = async (req, res, next) => {
    let Params = req.body;
    if (!Utils.checkBodyData(Params, ['account', 'password'])) {
        res.json({
            code: -1,
            msg: 'account | password not empty!'
        })
        return;
    }
    let { account, password } = Params;
    let [error, check] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('UserList', { "account": account.toUpperCase() },{"CreateDate":1}, true));
    if(check){
        res.json({
            code: -1,
            msg: 'This account is already registered!'
        })
        return;
    }
    let Timer = '' + Date.now();
    const HmacPwd = Utils.HmacFn(password, Timer);
    let params = { 
        account:account.toUpperCase(), 
        password: HmacPwd, 
        CreateDate: Timer,
        Permission:'0'
    }
    const [err, data] = await Utils.awaitWrap(_MongodbUtils.InsertDatabase(params, 'UserList'));
    if (!err) {
        res.json({
            code: 0,
            msg: 'sign up success'
        })
        return;
    }

    res.json({
        code: -1,
        msg:'sign up fail'
    })
}
const Permission = async (req,res,next)=>{
    let Params = req.body;
    if (!Utils.checkBodyData(Params, ['account'])) {
        res.json({
            code: -1,
            msg: 'account not empty!'
        })
        return;
    }
    let { account } = Params;
    let [err, data] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('UserList', { "account": account.toUpperCase() }, { "Permission":1 }, true));
    if (err || data.Permission!=='11') {
        res.json({
            code: -1,
            msg:'Permission fail'
        })
        return;
    }
    res.json({
        code: 0,
        msg: 'Permission success'
    })
}

function checkPasswordError(db_data, pwd) {
    let { password, CreateDate } = db_data;
    let hmac_pwd = Utils.HmacFn(pwd, CreateDate);
    if (hmac_pwd === password) return false;
    return true;
}
module.exports = {
    SignIn,
    SignUp,
    Permission
}

