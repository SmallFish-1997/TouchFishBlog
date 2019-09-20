// 新建文章接口
// const { InsertDatabase } = require('../mongodb');
let fs = require('fs');
let path = require('path');
let qiniu = require('qiniu');
let config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "config.json")));
let mac = new qiniu.auth.digest.Mac(config.AccessKey, config.SecretKey);
let options = {
    scope: config.Bucket,
    deleteAfterDays: 1,
    returnBody: '{"key":"$(key)","bucket":"$(bucket)"}'
};
let putPolicy = new qiniu.rs.PutPolicy(options);
module.exports = async (req, res, next) => {
    const TOKEN = putPolicy.uploadToken(mac);
    if(TOKEN) {
        res.json({
            code:0,
            token: TOKEN,
            msg: 'Get Token Success',
        });
        return;
    }
    res.json({
        msg: 'Get Token Fail',
        code:-1
    });
}


