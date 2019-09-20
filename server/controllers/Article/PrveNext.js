/**
 * @name 上一篇/下一篇文章链接
 */
const MongodbUtils = require('../../mongodb');
const _MongodbUtils = new MongodbUtils();
const Utils = require('../../public/utils');
const {ObjectID} = require('mongodb');

module.exports = async (req, res, next) => {
  let Params = req.body;
  if (Utils.checkBodyData(Params, ['id'])) {
    try{
      const [p_err, prve] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('ArticleList',{'_id' :{ "$gt" :ObjectID(Params.id)}},{"title":1,"_id":1},true));
      const [n_err, next] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('ArticleList',{'_id' :{ "$lt" :ObjectID(Params.id)}},{"title":1,"_id":1},true));
      let data = {
        prve:null,
        next:null
      }
      if (!p_err) {
        data.prve = prve;
      }
      if (!n_err) {
        data.next = next;
      }

      res.json({
        code: 0,
        msg: 'done',
        data
      });
    }catch(e){
      res.json({
        code: -1,
        msg: '该文章ID无效',
        errMsg:e
      });
    }
  } else {
    res.json({
      code: -1,
      msg: '缺少文章id',
    });
  }

}


