
const Router = require('koa-router')
// 引入jwt
const jwt = require('koa-jwt');
// 引入密码
const  { secret } = require('../config')
// 定义跟路由
const router = new Router({prefix:'/users'})
// 引入控制器 
const { 
  find, 
  findById,
  create, 
  update,
  del ,
  login ,
  checkOwner ,
  listFollowing ,
  follow ,
  unfollow , 
  listFollower ,
  checkUserExist , 
  followTopic , 
  unfollowTopic,    
  listFollowingTopics ,
  listQuestions, 
  listLikingAnswers, 
  likeAnswer, 
  unlikeAnswer, 
  listDisLikingAnswers, 
  dislikeAnswer, 
  undislikeAnswer , 
  listcollectingAnswers,
  collectAnswer,
  uncollectAnswer
} = require('../controllers/users')
const { checkTopicExist } = require('../controllers/topics')
// 检查答案是否存在
const { checkAnswerExist } = require('../controllers/answers')

/**
 * 
 * @param { 获取body信息 } ctx 
 * @param { 必填 进入下一个中间件 } next 
 */
const auth = jwt({secret})


// 获取所有用户列表
router.get('/', find)
// 处理post 请求 创建用户
router.post('/create' , create)
// 获取用户
router.get('/:id', auth , checkOwner, findById)
// 修改用户
router.patch('/:id', auth ,checkOwner, update)
// 删除用户
router.delete('/:id', auth ,checkOwner,  del )
// 登陆路由
router.post('/login', login )
// 获取关注列表
router.get('/:id/following',auth , listFollowing )
// 关注用户
router.put('/following/:id',auth ,checkUserExist ,follow)
// 取消关注
router.delete('/following/:id',auth , checkUserExist ,unfollow)
// 获取粉丝
router.get('/:id/followers',auth , listFollower)

// 获取用户关注列表
router.get('/listFollowingTopics/:id' , listFollowingTopics )
// 关注话题
router.put('/followingTopics/:id', auth ,followTopic )
// 取消关注话题
router.delete('/followingTopics/:id', auth  ,unfollowTopic )
// 获取问题列表
router.get('/:id/listQuestions',auth , listQuestions)
/**
 *  赞和踩
 * // 赞取消踩,踩 取消赞
 */
// 获取赞广告  id 是用户id
router.get('/linkingAnswers/:id' , listLikingAnswers )
// 点赞 id 是答案id
router.put('/linkingAnswers/:id', auth , checkAnswerExist ,likeAnswer ,undislikeAnswer )
// 取消赞  id 是答案id
router.delete('/linkingAnswers/:id', auth  ,unlikeAnswer )

// 获取踩  
router.get('/dislinkingAnswers/:id' , listDisLikingAnswers )
// 踩他
router.put('/dislinkingAnswers/:id', auth , checkAnswerExist ,dislikeAnswer , unlikeAnswer)
// 取消踩
router.delete('/dislinkingAnswers/:id', auth , checkAnswerExist ,undislikeAnswer )

/**
 * 收藏答案 和 取消收藏答案
 */

 // 获取答案
router.get('/collectingAnswers/:id' , listcollectingAnswers )
// 收藏答案
router.put('/collectingAnswers/:id', auth , checkAnswerExist ,collectAnswer ,)
// 取消受答案
router.delete('/collectingAnswers/:id', auth , checkAnswerExist ,uncollectAnswer )


module.exports = router

// 备注
// put 是整体替换
// patch 是更新一部分