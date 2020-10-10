const Router = require('koa-router')
const router = new Router()
// 引入控制器
const { index ,upload}  = require('../controllers/home')
// 使用路由 处理主页
router.get('/', index)
router.post('/upload',upload)
// 导出
module.exports = router 