// 根据类目筛选ArticleList文章
const MongodbUtils = require('../../mongodb');
const Utils = require('../../public/utils')
const _MongodbUtils = new MongodbUtils();
module.exports = async (req, res, next) => {
  let [error, category=[]] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('ArticleCategory',{}));
  if(!error&&category.length>0){
    let result = [];
    for await(let item of category){
      let [err, data] = await Utils.awaitWrap(_MongodbUtils.FindDatabase('ArticleList',{categorys:{$all:[item.name]}},{"_id":1,"title":1}));
      if(!err){
        result.push({
          category:item.name,
          articleList:data
        })
      }
    }
    res.json({
        code: 0,
        msg: '获取文章标题列表成功',
        list: result
    });
    
    return;
  }

  res.json({
    code: -1,
    msg: '获取文章标题列表失败',
    errMsg: err,
    list:[]
  });

}


