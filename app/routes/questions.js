const Router = require('koa-router')
// 引入jwt
const jwt = require('koa-jwt');
// 引入密码
const  { secret } = require('../config')
// 定义跟路由
const router = new Router({prefix:'/question'})
/**
 * 
 * @param { 获取body信息 } ctx 
 * @param { 必填 进入下一个中间件 } next 
 */
const auth = jwt({secret})

// 引入控制器
const {find, findById , create, update ,del , checkQuestionsExist, checkQuestioner } = require('../controllers/questions')
// 使用路由 处理主页
router.get('/',find)  
router.post('/', auth , create)
router.get('/:id', checkQuestionsExist ,findById)
router.patch('/:id', auth , checkQuestionsExist , checkQuestioner ,update)
router.delete('/:id', auth , checkQuestionsExist , checkQuestioner, del)

// 导出
module.exports = router 