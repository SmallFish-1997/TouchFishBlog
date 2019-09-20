// 新建文章接口
// const { InsertDatabase } = require('../mongodb');
const MongodbUtils = require('../../mongodb');
const _MongodbUtils = new MongodbUtils();
const Utils = require('../../public/utils');
const { ObjectID } = require('mongodb');

module.exports = async (req, res, next) => {
  let Params = req.body;
  if (Utils.checkBodyData(Params, ['_id','title', 'content','account','articleText','summaryInfo','categorys'])) {
    // check account
    let [error, info] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('UserList', { "account": Params.account.toUpperCase() }, {"Permission":1 }, true));
    
    if(error || !info.Permission || info.Permission!=='11'){
      res.json(ErrorTip());
      return;
    }
    // Update Article
    const _ID = Params._id;
    delete Params._id;
    const [err, data] = await Utils.awaitWrap(_MongodbUtils.UpdateDatabase('ArticleList',{ "_id": ObjectID(_ID)},{...Params},false));
    
    if (!err) {
      res.json({
        code: 0,
        msg: '编辑文章成功！',
      });
    }else{
      res.json(ErrorTip());
    }
  } else {
    res.json(ErrorTip());
  }

}

function ErrorTip(){
  return {
    code: -1,
    msg: '编辑文章失败！',
  }
}


