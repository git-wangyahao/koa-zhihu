/**
 * 使用Schema定义用户模型
 * 默认不现实，使用select：false
 */

const mongoose = require('mongoose')
const { Schema, model } = mongoose

// 定义Schema
const userSchema = new Schema({
  // 用户模型
  __v: { type:Number, required: false , select:false },
  name: { type:String, required: true },
  password: { type:String, required: true ,select:false},
  // 头像的url
  avatar_url: { type: String },
  /**
   * 性别 需要给个默认值
   * enum: ['male', 'female']代表可枚举的
   */
  gender: { type: String, enum: ['male', 'female'], default:'male', require: true },
  // 一句话介绍
  headline: { type: String },
  /**
   * type:[] 代表数组类型
   * 
   */
  locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topics' }] ,select:false},
  // 行业
  business: { type: Schema.Types.ObjectId , ref: 'Topics', select:false },
  // 职业经历
  employments: { 
    type: [{
        company:{ type: Schema.Types.ObjectId , ref: 'Topics', },  //公司
        job: { type: Schema.Types.ObjectId , ref: 'Topics',} // 工作
      }],
    select:false
   },

  //  http://localhost:9000/uploads/upload_bcf9940f7a7e274eb70627484d308dc6.jpg

  //  教育经历
  educations: {
    type:[
      {
        school:{ type: Schema.Types.ObjectId , ref: 'Topics' },  //学校
        major:{ type: Schema.Types.ObjectId , ref: 'Topics' },  // 专业
        diploma: { type:Number, enumerate: [1,2,3,4,5] }, // 学历
        entrance_year: { type:Number }, // 入学年份
        graduation_year: { type: Number }  // 毕业年份
      }
    ],
    select:false,
  },
  /**
   * { Schema.Types.ObjectId } 引用
   *  可以通过id 查询 
   *  功能是关注用户
   */
  following:{
    // 引用的写法
    type: [ { type :Schema.Types.ObjectId , ref: 'User'} ],
    select: false,
  },
  followingTopics: {
    // 引用的写法
    type: [ { type :Schema.Types.ObjectId , ref: 'Topics'} ],
    select: false,
  }

  // 
  // password: { type:String, required: true , select:false},
  // select:false 查询的时候是否显示这个字段，查询的时候可以使用语法单独查出来
}) 

// 设置用户模型 ,并导出
module.exports = model('User', userSchema );

