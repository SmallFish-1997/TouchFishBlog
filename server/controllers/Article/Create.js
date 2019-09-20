// 新建文章接口
// const { InsertDatabase } = require('../mongodb');
const MongodbUtils = require('../../mongodb');
const _MongodbUtils = new MongodbUtils();
const Utils = require('../../public/utils');

module.exports = async (req, res, next) => {
  let Params = req.body;
  if (Utils.checkBodyData(Params, ['title', 'content','account','articleText','summaryInfo','categorys'])) {
    // check account
    let [error, info] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('UserList', { "account": Params.account.toUpperCase() }, {"Permission":1 }, true));
    if(error || !info.Permission || info.Permission!=='11'){
      res.json(ErrorTip());
      return;
    }
    // Insert Article
    let _today = Utils.UnixToDate(Date.now(), 8);
    const [err, data] = await Utils.awaitWrap(_MongodbUtils.InsertDatabase({...Params,CreateDate:_today,views:0},'ArticleList','productid'));
    if (!err) {
      res.json({
        code: 0,
        msg: '发布文章成功！',
      });
    }else{
      res.json(ErrorTip(err));
    }
  } else {
    res.json(ErrorTip());
  }

}

function ErrorTip(err){
  return {
    code: -1,
    msg: '发布文章失败！',
    err:err||'error'
  }
}


