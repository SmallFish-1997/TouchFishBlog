const routers = require('express').Router();
// 文章
const ArticleList = require('../controllers/Article/List')
const CreateArticle = require('../controllers/Article/Create')
const ArticleDetail = require('../controllers/Article/Detail')
const ArticleDelete = require('../controllers/Article/Delete')
const ArticleUpdate = require('../controllers/Article/Update')
const ArticlePrveNext = require('../controllers/Article/PrveNext')
// 分类
const CategoryList = require('../controllers/Category/List')
const AddCategory = require('../controllers/Category/Add')
const CategoryArticleList = require('../controllers/Category/ArticleList')
// 七牛云
const QNgetToken = require('../controllers/Qiniu/getToken')

// 登录注册
const {SignIn,SignUp,Permission} = require('../controllers/Login')


routers.post('/Article/List',ArticleList)
.post('/api/Article/Create',CreateArticle)
.post('/api/Article/Detail',ArticleDetail)
.post('/api/Article/Delete',ArticleDelete)
.post('/api/Article/Update',ArticleUpdate)
.post('/api/Article/PrveNext',ArticlePrveNext)
.post('/api/Category/List',CategoryList)
.post('/api/Category/Add',AddCategory)
.post('/api/Category/ArticleList',CategoryArticleList)
.post('/api/qiniu/getToken',QNgetToken)
.post('/api/login/signin',SignIn)
.post('/api/login/signup',SignUp)
.post('/api/login/permission',Permission)
module.exports = routers;
