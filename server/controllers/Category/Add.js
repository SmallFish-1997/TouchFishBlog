// 添加分类
const MongodbUtils = require('../../mongodb');
const _MongodbUtils = new MongodbUtils();
const Utils = require('../../public/utils');

module.exports = async (req, res, next) => {
  let Params = req.body;
  if (Utils.checkBodyData(Params, ['categorys'])) {
    if(!Array.isArray(Params.categorys) || Params.categorys.length<=0){
      res.json({
        code: -1,
        msg: '缺少categorys分类参数',
      });
      return;
    }
    let many_params = [];
    Params.categorys.forEach(item=>{
      many_params.push({
        name:item
      })
    })
    const [err, data] = await Utils.awaitWrap(_MongodbUtils.InsertDatabase(many_params,'ArticleCategory','category_id',true));
    if (!err) {
      res.json({
        code: 0,
        msg: '添加分类成功',
      });
    }else{
        res.json({
            code: -1,
            msg: '添加分类失败',
            errMsg:err
        });
    }
  } else {
    res.json({
      code: -1,
      msg: '缺少categorys分类参数',
    });
  }

}


