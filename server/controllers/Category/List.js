// 分类列表
const MongodbUtils = require('../../mongodb');
const Utils = require('../../public/utils')
const _MongodbUtils = new MongodbUtils();

module.exports = async (req, res, next) => {
  let [err, data] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('ArticleCategory',{}));
  if (data) {
    res.json({
      code: 0,
      msg: '获取分类列表成功',
      list: data
    });
    return;
  }
  res.json({
    code: -1,
    msg: '获取分类列表失败',
    errMsg: err,
    list:[]
  });

}


