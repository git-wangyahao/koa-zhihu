//  引入 数据模式/结构
const Questions = require('../models/questions')
// 定义一个类
class QuestionsCtl { 
  // 检查问题是否存在
  async checkQuestionsExist(ctx , next) {

    const question = await Questions.findById(ctx.params.id).select('+questioner') ; 

    if(!question) {
      ctx.throw(404, "问题不存在 ")
    }
    ctx.state.question = question
 
    // 备注 await next 必须在外层
    await next()
  }

  // 检查提问者
  async checkQuestioner(ctx , next ) {
   
    const { question } = ctx.state
    if(question.questioner.toString() !== ctx.state.user._id ) {
      ctx.throw(404, "更新异常 ")
    } 
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
    const q = new RegExp(ctx.query.q)
    ctx.body = await Questions
    .find({
      $or:[{ title: q , description: q }]
    })
    .limit(perpage)
    .skip(page * perpage);
  }

  // 根据id查村
  async findById(ctx) {
    const { fields = "" } = ctx.query
    const selectyFields = fields.split(";").filter( f=> f).map(f => '+' + f).join()
    const question = await Questions.findById(ctx.params.id).select(selectyFields).populate('questioner topics')
    ctx.body = question
  }

  // 创建话题
  async create(ctx) {
    /**
     *  校验参数
     *  注意类型值为字符串类型
     */
    ctx.verifyParams({ 
      title:{ type: 'string', required: true  },
      description: { type: 'string' ,required:false},
      topics: { type: 'array', itemType:'string', required: false } 
    }) 

    
    const question = await new Questions({ ...ctx.request.body, questioner:ctx.state.user._id } ).save()
    ctx.body = question
  }

  // 更新
  async update(ctx) {
    ctx.verifyParams({ 
      title:{ type: 'string', required: false  },
      description: { type: 'string' ,required:false },
    }) 
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question 
  }

  // 删除 
  async del(ctx) {
    await Questions.findByIdAndRemove(ctx.params.id) ;
    ctx.status = 204;
  }

  // 获取话题粉丝

}
module.exports = new QuestionsCtl()