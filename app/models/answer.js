/**
 * 使用Schema定义用户模型
 * 默认不现实，使用select：false
 */

const mongoose = require('mongoose')
const { Schema, model } = mongoose

// 定义答案 Schema
const answerSchema = new Schema({
  // 用户模型
  __v: { type:Number, required: false , select: false },
  content:{ type:String, required: true  },
  answerer: { type: Schema.Types.ObjectId , ref: "User", required: true ,select:false },
  
  // 答案从属于id 一个 问题有多个答案 一个答案只有一个问题
  questionId:{ type: String, required: true } , // 问题id
  // 记录投票数 -- 赞 或者 踩 
  voteCount: { type: Number, required: true , default: 0}
}) 

// 设置用户模型 ,并导出
module.exports = model('Answers', answerSchema );

