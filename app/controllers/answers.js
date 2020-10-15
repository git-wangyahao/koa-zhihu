//  引入 数据模式/结构
const Answers = require('../models/answer')
// 定义一个类
class AnswersCtl { 
  // 检查问题是否存在
  async checkAnswerExist(ctx , next) {

    const answers = await Answers.findById(ctx.params.id).select('+answerer') ; 

    if(!answers) {
      ctx.throw(404, "答案不存在 ")
    }
    // 判断答案是否在本问题下面 
    // 只有删改查答案是才检查此逻辑, 赞 踩 答案时候不检查
    if(ctx.params.questionId && ctx.params.questionId !==  answers.questionId ) {
      ctx.throw(404, "该问题下没有此答案 ")
    }
    ctx.state.answers = answers
 
    // 备注 await next 必须在外层
    await next()
  }

  // 检查提问者
  async checkAnswer(ctx , next ) {

    const { answers } = ctx.state
    if(answers.answerer.toString() !== ctx.state.user._id ) {
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
    ctx.body = await Answers
    .find({
      $or:[{ content: q , questionId: ctx.params.questionId }]
    })
    .limit(perpage)
    .skip(page * perpage);
  }

  // 根据id查村
  async findById(ctx) {
    console.log("ctx",ctx.query)
    const { fields = "" } = ctx.query
    const selectyFields = fields.split(";").filter( f=> f).map(f => '+' + f).join()
    const answers = await Answers.findById(ctx.params.id).select(selectyFields).populate('answerer')
    ctx.body = answers
  }

  // 创建话题
  async create(ctx) {
    /**
     *  校验参数
     *  注意类型值为字符串类型
     */
    ctx.verifyParams({ 
      content:{ type: 'string', required: true  },
    }) 
    const answerer = ctx.state.user._id
    const { questionId } = ctx.params

    const answers = await new Answers({ ...ctx.request.body, answerer, questionId } ).save()
    ctx.body = answers
  }

  // 更新
  async update(ctx) {
    console.log("ctx",ctx)
    ctx.verifyParams({ 
      content: { type: 'string' , required:false },
    }) 
    await ctx.state.answers.update(ctx.request.body)
    ctx.body = ctx.state.answers 
  }

  // 删除 
  async del(ctx) {
    await Answers.findByIdAndRemove(ctx.params.id) ;
    ctx.status = 204;
  }

  // 获取话题粉丝

}
module.exports = new AnswersCtl()