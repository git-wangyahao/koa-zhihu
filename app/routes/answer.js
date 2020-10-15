const Router = require('koa-router')
// 引入jwt
const jwt = require('koa-jwt');
// 引入密码
const  { secret } = require('../config')
// 定义跟路由
const router = new Router({prefix:'/question/:questionId/answers'})
/**
 * 
 * @param { 获取body信息 } ctx 
 * @param { 必填 进入下一个中间件 } next 
 */
const auth = jwt({secret})

// 引入控制器
const {find, findById , create, update ,del , checkAnswerExist, checkAnswer } = require('../controllers/answers')
// 使用路由 处理主页
router.get('/',find)    // 根据问题id ,获取答案列表
router.post('/', auth , create)  // 创建答案
router.get('/:id', checkAnswerExist ,findById)  // 根据答案id 获取指定问题的答案
router.patch('/:id', auth , checkAnswerExist , checkAnswer ,update) 
router.delete('/:id', auth , checkAnswerExist , checkAnswer, del)

// 导出
module.exports = router 