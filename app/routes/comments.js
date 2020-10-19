const Router = require('koa-router')
// 引入jwt
const jwt = require('koa-jwt');
// 引入密码
const  { secret } = require('../config')
// 定义跟路由
const router = new Router({prefix:'/question/:questionId/answers/:answerId/comments'})
/**
 * 
 * @param { 获取body信息 } ctx 
 * @param { 必填 进入下一个中间件 } next 
 */
const auth = jwt({secret})

// 引入控制器
const {find, findById , create, update ,del , checkCommentExist, checkCommentator } = require('../controllers/comments')
// 使用路由 处理主页
router.get('/',find)    // 根据问题id ,获取答案列表
router.post('/', auth , create)  // 创建评论
router.get('/:id', checkCommentExist ,findById) // 查看评论  
router.patch('/:id', auth , checkCommentExist , checkCommentator ,update) 
router.delete('/:id', auth , checkCommentExist , checkCommentator, del)

// 导出
module.exports = router 