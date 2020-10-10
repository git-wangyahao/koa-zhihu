//  引入 数据模式/结构
const User = require('../models/users')
// 引入jwt
const jsonwebtoken = require('jsonwebtoken')
// 引入密码
const  { secret } = require('../config')
// 错误备注
// 之前接口一直报错，原因是mongdb 方法需要 数据模型调用，我没有调用

// 定义一个类
class UserCtl { 
  /**
   * 获取所有的用户列表  -- 接口没问题
   * @param {} ctx 
   */
  async find(ctx) {

    const { per_page = 2 } = ctx.query
    /**
     * limit(10) 代表每页多少项
     * skip(10) 代表跳过多少项
     */
    const page = Math.max(ctx.query.page * 1 , 1) - 1;
    const perpage = Math.max(per_page * 1 , 1) // 获取最大项 默认为1 

    ctx.body = await User.find().limit(perpage).skip(page * perpage);
  }
  /**
   * 根据ID获取用户的信息 
   * @param {} ctx 
   */
  async findById(ctx) {
    const { fields = '' } = ctx.query
    /**
     * 查询某些字段的数据
     * 注意 连字符 + 号
     */
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f ).join('');
    // 枚举 populateStr 不太懂
    const populateStr = fields.split(';').filter(f => f).map( 
      f => {
        if(f === 'employments') {
          return 'employments.company employments.job ';
        }
        if(f === 'educations') {
          return 'educations.school educations.major ';
        } else {
          return f
        }
      }
    ).join(' ');
    console.log(populateStr)
    const user = await User.findById(ctx.params.id).select(selectFields).populate(populateStr)
    
    if(!user) {
      ctx.throw(404, "用户不存在")
    }
    ctx.body = user
  }

  /**
   * 注册用户
   *  新建用户接口 接口没问题
   * @param { } ctx 
   */
  async create(ctx) {
    // 校验参数 ,校验失败返回422
    ctx.verifyParams({
      name:{
        type: "string", required: true,
      },
      password:{
        type: "string", required: true,
      }
    })
    // 校验用户名
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({ name }) // 返回单个文档
    if(repeatedUser) {ctx.throw(409,'用户已经存在')}
    // 新增
    const user =  await new User(ctx.request.body).save();
    ctx.body = user
  }

  /**
   * 编写校验用户是否存在的中间件
   * @param {*} ctx 
   * @param {*} next 
   */
  async checkUserExist(ctx ,next) {
    const user = await User.findById(ctx.params.id)
    if(!user) {
      ctx.throw(404 ,"用户不存在")
    }
    await next()
  }



  /**
   *  
   * 校验用户名是不是自己
   * @param {*} ctx 
   * @param { 中间件函数 } next 
   */
  async checkOwner(ctx ,next) {
    if(ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403 ,"操作的不是自己")
    }
    await next()
  }

  // 更新用户信息 必须只能更新自己的信息，不能更新别人的信息
  async update(ctx) {
    ctx.verifyParams({
      password:{ type: 'string', required: false},
      avatar_url: { type:'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      // itemType 代表数组里面的每一项
      locations: { type: 'array', itemType:'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType:'object', required: false },
      educations: { type: 'array', itemType:'object', required: false },
    })
    // 校验用户名
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({ name }) // 返回单个文档
    if(repeatedUser) {ctx.throw(409,'用户已经存在')}
    
    const user = await User.findByIdAndUpdate( ctx.params.id, ctx.request.body)
    if(!user) {
      ctx.throw(404, "用户不存在")
    }
    ctx.body = user
  }

  // 删除用户名 / 应该可以删除别人的信息
  async del(ctx) {
    // 校验 参数
    const user = await User.findByIdAndRemove(ctx.params.id)
    if(!user) {
      ctx.throw(404, "用户不存在")
    }
    
    ctx.body= {
      status : 204,
      message:"删除成功"
    }
  }

  // 登陆函数
  async login(ctx) {
    console.log("登陆控制器 ",ctx.header)
    ctx.verifyParams({
      name:{
        type: "string", require: true,
      },
      password:{
        type: "string", required: true,
      }
    })
   
    // 去数据库拿用户信息

    const user = await User.findOne(ctx.request.body)

    if(!user) {
      ctx.throw(401,"用户名或密码不正确")
    }
    
    const { _id , name } = user
 
    // /**
    //  * 生成密码
    //  * 参数2 是密码
    //  * 参数3 是过期时间
    //  */
    console.log("密钥",secret)
    const token = jsonwebtoken.sign({
      _id , name
    }, secret);
    
    ctx.body = { token ,name ,_id}
  }

  // 获取关注者
  async listFollowing(ctx) {
    // 注 select 作用是 选择 默认不查询的，populate 取出指定字段
    const user = await User.findById(ctx.params.id).select("+following").populate('following')

    if(!user) {
      ctx.throw(401,"关注者不存在")
    }

    ctx.body = user.following
  }

  // 关注用户
  async follow (ctx) {
    // 根据自己的ID 查询出个人信息
    const me = await User.findById(ctx.state.user._id).select('+following') 
    console.log("ctx11",me) 
    // 把关注者的id 放在自己的数组中
    if ( !me.following.map(id => id.toString()).includes(ctx.params.id) ) {
      me.following.push(ctx.params.id)
      me.save()
    }
    // 保存在数据库中
    ctx.status = 204
  }

  // 取消用户
  async unfollow (ctx) {
    // 根据自己的ID 查询出个人信息
    const me = await User.findById(ctx.state.user._id).select('+following') 
    const index = me.following.map( id => id.toString()).indexOf(ctx.params.id)
    // 把关注者的id 放在自己的数组中
    if ( index > -1 ) {
      me.following.splice(index, 1);
      me.save()
    }
    // 保存在数据库中
    ctx.status = 204
  }

  // 获取粉丝
  async listFollower(ctx) {
    const users = await User.find({ following: ctx.params.id })
    ctx.body = users
  }

  /**
   * 获取用户关注的话题
   */
  async listFollowingTopics(ctx) {
    // 注 select 作用是 选择 默认不查询的，populate 取出指定字段
    console.log(ctx.params.id)
    const user = await User.findById(ctx.params.id).select("+followingTopics").populate('followingTopics')

    if(!user) {
      ctx.throw(404,"用户不存在")
    }

    ctx.body = user.followingTopics
  }





  /**
   * 关注用户
   * 关注话题，关注话题和关注人逻辑差不多
   */

async followTopic (ctx) {
  // 根据自己的ID 查询出个人信息
  const me = await User.findById(ctx.state.user._id).select('+followingTopics') 
  console.log("ctx11",me) 
  // 把关注者的id 放在自己的数组中
  if ( !me.followingTopics.map(id => id.toString()).includes(ctx.params.id) ) {
    me.followingTopics.push(ctx.params.id)
    me.save()
  }
  // 保存在数据库中
  ctx.status = 204
}

// 取消用户
async unfollowTopic (ctx) {
  // 根据自己的ID 查询出个人信息
  const me = await User.findById(ctx.state.user._id).select('+followingTopics') 
  const index = me.followingTopics.map( id => id.toString()).indexOf(ctx.params.id)
  // 把关注者的id 放在自己的数组中
  if ( index > -1 ) {
    me.followingTopics.splice(index, 1);
    me.save()
  }
  // 保存在数据库中
  ctx.status = 204
}



}
module.exports = new UserCtl()