/**
 * 使用Schema定义用户模型
 * 默认不现实，使用select：false
 */

const mongoose = require('mongoose')
const { Schema, model } = mongoose

// 定义Schema
const questionSchema = new Schema({
  // 用户模型
  __v: { type:Number, required: false , select: false },
  title:{ type:String, required: true  },
  description: { type:String },
  questioner: { type: Schema.Types.ObjectId , ref: "User", required: true ,select:false },
  topics:{
    type: [{type: Schema.Types.ObjectId , ref: "Topics", required: false }],
    select:false
  }
  // 问题的话题一般不是很多
}) 

// 设置用户模型 ,并导出
module.exports = model('Questions', questionSchema );

