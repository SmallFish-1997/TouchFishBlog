// 新建文章接口
// const { InsertDatabase } = require('../mongodb');
const { ObjectID } = require('mongodb');
const MongodbUtils = require('../../mongodb');
const _MongodbUtils = new MongodbUtils();
const Utils = require('../../public/utils');

module.exports = async (req, res, next) => {
    let Params = req.body;
    if (Utils.checkBodyData(Params, ['account','_id'])) {
         // check account
        let [error, info] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('UserList', { "account": Params.account.toUpperCase() }, {"Permission":1 }, true));
        if(error || !info.Permission || info.Permission!=='11'){
        res.json(ErrorTip());
        return;
        }
        const [err, data] = await Utils.awaitWrap(_MongodbUtils.DeleteDatabase('ArticleList', { "_id": ObjectID(Params._id) }, false));
        if (!err) {
            res.json({
                code: 0,
                msg: 'done',
            });
            return;
        }
        res.json(ErrorTip());
    } else {
        res.json(ErrorTip());
    }

}


function ErrorTip(){
    return {
        code: -1,
        msg: '删除文章失败',
    };
  }
  