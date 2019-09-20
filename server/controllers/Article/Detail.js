// 新建文章接口
// const { InsertDatabase } = require('../mongodb');
const {ObjectID} = require('mongodb');
const MongodbUtils = require('../../mongodb');
const _MongodbUtils = new MongodbUtils();
const Utils = require('../../public/utils');

module.exports = async (req, res, next) => {
  let Params = req.body;
  if (Utils.checkBodyData(Params, ['id'])) {
    try{
      const [err, data] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('ArticleList',{"_id":ObjectID(Params.id)},{"_articleID":0,"summaryInfo":0},true));
      if (!err) {
        res.json({
          code: 0,
          msg: 'done',
          detail:data
        });
        let count = await Utils.awaitWrap(_MongodbUtils.FindOneAndUpdateDB('ArticleList',{ "_id": ObjectID(Params.id)},'views'));
        console.log(count,'-count------');
        
      }
    }catch(e){
      res.json({
        code: -1,
        msg: '该文章ID无效',
        detail:{},
        errMsg:e
      });
    }
  } else {
    res.json({
      code: -1,
      detail:{},
      msg: '缺少文章id',
    });
  }

}


