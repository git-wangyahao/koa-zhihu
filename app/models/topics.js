/**
 * 使用Schema定义用户模型
 * 默认不现实，使用select：false
 */

const mongoose = require('mongoose')
const { Schema, model } = mongoose

// 定义Schema
const topicsSchema = new Schema({
  // 用户模型
  __v: { type:Number, required: false , select:false },
  name:{ type:String, required: false  },
  avatar_url: { type:String ,select:false},
  introduction: { type:String , select:false }
}, { timestamps: true }) 

// 设置用户模型 ,并导出
module.exports = model('Topics', topicsSchema );

