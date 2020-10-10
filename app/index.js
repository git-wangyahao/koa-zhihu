const Koa = require('koa');
const path = require('path');
const app = new Koa()
// 引入解析body参数的中间件
const kaoBody = require('koa-body')

// 使用 koa-router 实现 路由
const routing = require('./routes')
// 引入错误处理中间件

const error = require('koa-json-error')
// 引入校验参数中间件
const parameter = require('koa-parameter')

const mongoose = require('mongoose')
const { connectionStr } = require( './config')

// 注册 npm install koa-static --save
const koaStatic = require('koa-static')


/**
 * 使用mongodb 
 */


mongoose.connect(connectionStr , {useUnifiedTopology: true, useNewUrlParser: true} ,() => {
  console.log("mongdb 连接成功了")
} )
mongoose.connection.on('error' , console.error)

// 静态文件路径


app.use(koaStatic(path.join(__dirname,'public')))

app.use(parameter(app))
/**
 * 处理前缀
 * 传递一个对象{prefix:'/users'}
 */
// 创建鉴权中间件

// 多中间件的实现需要传递一个next参数 使用async 和 await 中间件放在路径和 回调中间
// 405Method Not Allowed 不允许
// 501Not Implemented 没实现
app.use(kaoBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions:true
  }
}))
// 使用错误处理中间件
const options = { 
  postFormat : (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest: { stack, ...rest }
}
// end
app.use(error(options))
// http options 方法 
routing(app)
app.listen('9000',() => {
  console.log("服务已启动请访问,localhost:9000")
})

