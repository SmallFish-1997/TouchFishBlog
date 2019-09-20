// Mongodb 
const { MongoClient } = require('mongodb');
const Utils = require('../public/utils');

// Mongodb工具类
module.exports = class MongodbUtil {
    constructor() {
        this.DB_URL = "mongodb://localhost:27017"; //mongodb 地址
        this.DB_NAME = 'TouchFish'; //database 名称
        // 表名
        // ArticleList:文字列表
        this.collections = ['ArticleList']
        this.client = null; //服务器连接对象
        this._DB = null; //Databse对象
    }
    // 初始化数据库 - name = Database Name
    initClient() {
        const _this = this;
        return new Promise(async (resolve, reject) => {
            try {
                _this.client = await MongoClient.connect(_this.DB_URL, { useNewUrlParser: true });
                _this._DB = _this.client.db(_this.DB_NAME);
                resolve(true);
            } catch (err) {
                reject(err);
            }
        })
    }

    /**
     * @name 查找DB数据
     * @param {string} name collection - 表名
     * @param {object} query 查询条件1
     * @param {object} projection 查询条件2
     * @param {boolean} isOnce 是否查询一条
     * @return {Promise}
     * */
    FindDatabase(name, query, projection, isOnce) {
        const _this = this;
        return new Promise(async (resolve, reject) => {
            let [err, data] = await Utils.awaitWrap(_this.initClient())
            if (!err) {
                try {
                    let findResult;
                    // 查询一条
                    if (isOnce) {
                        if (projection) {
                            findResult = await _this._DB.collection(name).findOne(query, { projection });
                        } else {
                            findResult = await _this._DB.collection(name).findOne(query);
                        }
                        if (findResult) {
                            resolve(findResult);
                        }
                        reject(`Data can't be find`);
                    } else { //查询多条
                        if (projection) {

                            findResult = await _this._DB.collection(name).find(query).project(projection).sort({ _articleID: -1 });

                            // findResult = await _this._DB.collection(name).find({}, { projection }).sort({_articleID:-1});
                        } else {
                            findResult = await _this._DB.collection(name).find(query).sort({ _articleID: -1 });
                        }
                        findResult.toArray(function (e, docs) {
                            if (!e) {
                                resolve(docs);
                            }
                            reject(e);
                        })
                    }

                } catch (e) {
                    reject(err);
                    console.log(e, '--- find database fail ---');
                }
                _this.client.close();
            } else {
                reject(err);
            }
        })
    }
    /**
     * @name 新增DB数据
     * @param {Object} params 入参
     * @param {string} name collection - 表名
     * @param {string} productid 自增ID
     * @param {boolean} isMany 新增多条
     * @return {Promise}
     */
    InsertDatabase(params, name, productid, isMany) {
        const _this = this;
        return new Promise(async (resolve, reject) => {
            let [err, data] = await Utils.awaitWrap(_this.initClient())
            if (!err) {
                try {
                    if (isMany) {
                        await _this._DB.collection(name).insertMany(params);
                    } else {
                        let insert_data = { ...params };
                        if (productid) {
                            insert_data._articleID = await _this.FindOneAndUpdateDB('counters', { _id: productid }, 'sequence_value');
                        }
                        await _this._DB.collection(name).insertOne(insert_data);
                    }
                    resolve(true);
                } catch (e) {
                    console.log(e, '-------insert database error -----');
                    reject(e);
                }
                _this.client.close();
                return;
            }
            reject(err);
        })
    }

    /**
     * @name 删除DB数据
     * @param {string} name collection - 表名 
     * @param {Object} params 删除规则
     * @param {boolean} isMany 是否删除多条
     * @return {Promise}
     *  */
    DeleteDatabase(name, params, isMany) {
        const _this = this;
        return new Promise(async (resolve, reject) => {
            let [err, data] = await Utils.awaitWrap(_this.initClient())
            if (!err) {
                try {
                    if (isMany) {
                        await _this._DB.collection(name).deleteMany(params);
                    } else {
                        await _this._DB.collection(name).deleteOne(params);
                    }
                    resolve(true);
                } catch (e) {
                    reject(e);
                }
                _this.client.close();
                return;
            }
            reject(err);
        })
    }
    /**
     * @name 更新DB数据
     * @param {string} name collection - 表名 
     * @param {Object} filter 过滤规则
     * @param {Object} updata 要更新的数据
     * @param {boolean} isMany 是否更新多条
     * @return {Promise}
     *  */
    UpdateDatabase(name, filter, updata, isMany) {
        const _this = this;
        return new Promise(async (resolve, reject) => {
            let [err, data] = await Utils.awaitWrap(_this.initClient())
            if (!err) {
                try {
                    if (isMany) {
                        await _this._DB.collection(name).updateMany(filter, { $set: updata });
                    } else {
                        await _this._DB.collection(name).updateOne(filter, { $set: updata });
                    }
                    resolve(true);
                } catch (e) {
                    reject(e);
                }
                _this.client.close();
                return;
            }
            reject(err);
        })
    }

    /**
     * @name 查询并更新DB数据
     * @param name collection表名
     * @param query 过滤条件 
     * @param key 要更新的文档key
     * */
    FindOneAndUpdateDB(name, query, key) {
        const _this = this;
        return new Promise(async (resolve, reject) => {
            let [err, data] = await Utils.awaitWrap(_this.initClient())
            console.log(name, query, key, '-name,query, key');
            if(err){
                reject(err);
                return;
            }
            try {
                // findOneAndUpdate - 返回修改数据前的对象
                let sequenceDocument = await _this._DB.collection(name).findOneAndUpdate(
                    query,
                    { $inc: { [key]: 1 } },
                );
                console.log(sequenceDocument.value[key], '-sequenceDocument.value[key]');
                resolve(sequenceDocument.value[key])
            } catch (e) {
                reject(e);
            }
            

        })
    }
}





