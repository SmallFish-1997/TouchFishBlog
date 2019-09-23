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
.post('/Article/Create',CreateArticle)
.post('/Article/Detail',ArticleDetail)
.post('/Article/Delete',ArticleDelete)
.post('/Article/Update',ArticleUpdate)
.post('/Article/PrveNext',ArticlePrveNext)
.post('/Category/List',CategoryList)
.post('/Category/Add',AddCategory)
.post('/Category/ArticleList',CategoryArticleList)
.post('/qiniu/getToken',QNgetToken)
.post('/login/signin',SignIn)
.post('/login/signup',SignUp)
.post('/login/permission',Permission)
module.exports = routers;
