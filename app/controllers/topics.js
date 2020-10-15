//  引入 数据模式/结构
const Topics = require('../models/topics')
const User = require('../models/users')
const Questions = require('../models/questions')
// 定义一个类
class TopicsCtl { 
  // 中间件
  async checkTopicExist(ctx , next) {
    const topic = await Topics.findById(ctx.params.id) ; 
    if(!topic) {
      ctx.throw(404, "话题不存在 ")
    }
    // 备注 await next 必须在外层
    await next()
  }

  // 查询 
  async find(ctx) {
    // 分页功能
    const { per_page = 10 } = ctx.query
    /**
     * limit(10) 代表每页多少项
     * skip(10) 代表跳过多少项
     * .find({name: new RegExp(ctx.query.q)})  模糊搜索
     */
    const page = Math.max(ctx.query.page * 1 , 1) - 1;
    const perpage = Math.max(per_page * 1 , 1) // 获取最大项 默认为1 

    ctx.body = await Topics
    .find({
      name: new RegExp(ctx.query.q)
    })
    .limit(perpage)
    .skip(page * perpage);
  }

  // 根据id查村
  async findById(ctx) {
    const { fields = "" } = ctx.query
    const selectyFields = fields.split(";").filter( f=> f).map(f => '+' + f).join()
    const topic = await Topics.findById(ctx.params.id).select(selectyFields)
    ctx.body = topic
  }

  // 创建话题
  async create(ctx) {

    /**
     *  校验参数
     *  注意类型值为字符串类型
     */
    ctx.verifyParams({ 
      name:{ type: 'string', required: true },
      avatar_url:{ type: 'string', required: false },
      introduction:{ type: 'string', required: false },
    }) 

    const topic = await new Topics(ctx.request.body).save()
    ctx.body = topic
  }

  // 更新
  async update(ctx) {
    ctx.verifyParams({ 
      name:{ type: 'string', required: false },
      avatar_url:{ type: 'string', required: false },
      introduction:{ type: 'string', required: false },
    }) 
    const topic = await Topics.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    ctx.body = topic
  }

  // 获取话题粉丝

  async listFollower(ctx) {
    const users = await User.find({ followingTopics: ctx.params.id })
    ctx.body = users
  }

  // 列出问题
  async listQuestion(ctx) {
    const questions = await Questions.find({ topics: ctx.params.id })
    ctx.body = questions
  }

}
module.exports = new TopicsCtl()