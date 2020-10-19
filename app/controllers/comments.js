//  引入 数据模式/结构
const Comments = require('../models/comments')
// 定义一个类
class CommentsCtl { 
  // 检查评论是否存在
  async checkCommentExist(ctx , next) {

    const comments = await Comments.findById(ctx.params.id).select('+answerer') ; 

    if(!comments) {
      ctx.throw(404, "评论不存在 ")
    }
    // 判断答案是否在本问题下面 
    // 只有删改查答案是才检查此逻辑, 赞 踩 答案时候不检查
    if(ctx.params.questionId && ctx.params.questionId !==  comments.questionId ) {
      ctx.throw(404, "该问题下没有此评论 ")
    }
    // 检查答案
    if(ctx.params.answerId && ctx.params.answerId !==  comments.answerId ) {
      ctx.throw(404, "该答案下没有此评论 ")
    }
    ctx.state.comments = comments
 
    // 备注 await next 必须在外层
    await next()
  }

  // 检查提问者
  async checkCommentator(ctx , next ) {
    const { comments } = ctx.state
    if(comments.answerId.toString() !== ctx.state.user._id ) {
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
    const { questionId ,answerId } = ctx.params
    const { rootCommentId } = ctx.query
    ctx.body = await Comments
    .find({
      $or:[{ comment: q , questionId , answerId }]
    })
    .limit(perpage)
    .skip(page * perpage)
    .populate('commentator replyTo') 
  }

  // 根据id查村
  async findById(ctx) {
    console.log("ctx",ctx.query)
    const { fields = "" } = ctx.query
    const selectyFields = fields.split(";").filter( f=> f).map(f => '+' + f).join()
    const comments = await Comments.findById(ctx.params.id).select(selectyFields).populate('commentator')
    ctx.body = comments
  }

  // 创建话题
  async create(ctx) {
    /**
     *  校验参数
     *  注意类型值为字符串类型
     */
    ctx.verifyParams({ 
      comment:{ type: 'string', required: true  },
      rootCommentId: {  type: 'string', required: true },
      replyTo: {  type: 'string', required: true },
    }) 
    const commentator = ctx.state.user._id
    const { questionId ,answerId } = ctx.params

    const answers = await new Comments({ ...ctx.request.body, commentator, questionId, answerId } ).save()
    ctx.body = answers
  }

  // 更新
  async update(ctx) {
    console.log("ctx",ctx)
    ctx.verifyParams({ 
      comment: { type: 'string' , required:false },
    }) 
    const { comment } = ctx.request.body
    await ctx.state.comments.update( {comment} )
    ctx.body = ctx.state.comments 
  }

  // 删除 
  async del(ctx) {
    console.log(ctx.params.id)
    await Comments.findByIdAndRemove(ctx.params.id) ;
    ctx.status = 204;
  }

  // 获取话题粉丝

}
module.exports = new CommentsCtl()