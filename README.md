### 使用说明
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build



### 开发文档

#### 安装路由
npm i koa-router --save
#### 安装解析请求体
npm i koa-bodyparser --save

<!-- 更合理的目录结构 -->
#### 更合理的目录u结构
1、将路由单独放在一个目录
2、将控制器单独放在一个目录
3、使用类+类方法的方式组织控制器

#### 异常状况有哪些
1、运行时错误 ，都返回 500
2、逻辑错误，如找不到（400），先决条件失败（415），无法处理的实体（参数格式不对422）
#### 为什么要用错误处理
3、错误处理防止程序挂掉
4、告诉用户错误信息
5、便于开发者调试
#### koa自带错误处理
404 错误 
例如 ： 路由找不到 就会报 404 错误
412 错误 先决条件失败
例如 参数>数据条数
500 运行时错误
#### 使用koa-json-error 来处理错误处理

https://github.com/koajs/json-error

#### cross-env 跨平台环境变量
npm install --save-dev cross-env 
https://github.com/kentcdodds/cross-env
#### 使用koa-parameter校验参数
https://github.com/koajs/parameter
npm install koa-parameter --save

#### 使用mongoDB 储存数据
1、为什么要用mongoDB 
性能好（内存计算）
大规模的数据存储（可拓展性）
数据安全可靠（本地复制，自动故障转移）
方便储存复杂数据结构（Schema Free）

#### 免费版 云 mongoDB Atlas 

操作步骤：
1、注册用户
2、创建集群
3、添加数据库用户
4、设置IP地址白名单
5、获取链接地址

zhihu  wangyahao

mongodb+srv://admin:root@cluster0.cwosk.mongodb.net/<dbname>?retryWrites=true&w=majority
#### 使用mongoose连接 mongodb 
http://www.mongoosejs.net/docs/index.html
npm install mongoose --save 

#### 设置用户 Schema 
1、分析用户模块的属性
2、编写用户模块的Schema
3、使用Schema 生成用户的 Model

#### 使用MongoDB实现用户的增删改查
1、使用mongoose 实现增删改查
2、用postman测试接口
3、具体代码查看代码

### session 认证授权

1、JSON WebToken 是一个开放标准 （RFC 7519）
2、定义了一个紧凑且独立的方式，可以将各方之间的信息作为JSON对象进行安全传输
3、该信息可以验证和信任，因为是经过数字签名的。
#### 构成
1、头部
2、有效载荷
3、签名

#### JWT vs Session
JWT时效性有问题

#### 在node.js 中使用JWT
1、按装 npm i jsonwebtoken
1.2 引入 jwt = require( 'jsonwebtoken ')
1.3 使用签名算法加密 token  = jwt.sign({ name: 'wangyahao'}, 'secret' )
2、解码算法 ：jwt.decode(token)
3、认证签名 jwt.verify( token , 'secret' ) 

#### 实现用户注册
1、重新设置 Schema
2、保证用户名的唯一性

#### 实现登陆 并操作token
1、登陆接口设计
2、用jsonwebtoken 生成token
3、

#### koa中间件实现用户认证与授权
0、一个中间件就是一个函数
1、
2、
3、
#### 
````javascript
  //在 postman 配置自动化执行代码
  var jsonData = pm.response.json();
  pm.globals.set("token", jsonData.token);
````

#### 使用koa-jwt中间件 做用户权限校验
1 安装 npm i koa-jwt --save
2 使用中间件保护接口
3 使用中间件获取用户信息


#### 上传图片功能点
1、基础功能  ： 上传图片，生成图片链接
2、附件功能，限制上传图片的大小与类型，生成高中低三种分辨率的图片链接，生成CDN
生成cdn 就是分发到全球服务器，请求的时候是从最近的服务器请求

#### 上传图片的技术方案
1、阿里云OSS等云服务器，推荐在生产环境下使用
2、直接上传到服务器，不推荐在生产环境下中使用。

#### 使用koa-body 中间件获取上传的文件
1、安装  替换掉koa-bodyparsernpm 
2、设置图片上传目录
3、使用postman上传文件

#### 使用koa-static 生成图片链接
1、安装 koa-static 中间件 npm install koa-static --save  注册
2、设置静态文件目录 代码在控制器下的 home.js 中
3、生成图片链接

#### 个人资料功能点
1、不同类型（如字符串、数组）的属性
2、字段过滤

#### 个人资料的schema设计
1、其实就是数据结构的设计
2、操作步骤
2.1 分析个人资料的数据结构
2.2 设计个人资料的schema
2.3 个人资料的参数校验
2.3.1 分析个人资料的参数结构
2.3.2 编写代码校验个人资料的参数
3、字段过滤 --- RESTful 最佳实践
3.1 设计schema 默认隐藏部分字段
3.2 通过查询字符串显示隐藏字段 

````javascritp
   // 测试代码
   //   http://localhost:9000/uploads/upload_bcf9940f7a7e274eb70627484d308dc6.jpg
   {
    "avatar_url": "http://localhost:9000/uploads/upload_bcf9940f7a7e274eb70627484d308dc6.jpg",
    "gender":"male",
    "headline":"我是王亚浩",
    "locations": [ "杭州", "北京" ],
    "business":"互联网",
    "employments": [{ "company":"阿里巴巴", "job":"前端专家" }],
    "educations":[{ "school":"清华大学","major":"计算机专业","diploma":3,"entrance_year": 2001,"graduation_year":2005 }]
  }
  name: id   : 5f70641ac68b774b630cce19
````


````javascrtip
  postman 自动化脚本代码
  var jsonData = pm.response.json();
  pm.globals.set("token", jsonData.token);  

````

#### 接口只能删除自己
1、中间需要加一个中间件 检查是否是自己的逻辑
2、就是修改用户的id，如果不是自己的id，则403代表授权失败


#### 关注和取消关注 功能点
1、获取关注人、粉丝列表（ 用户 - 用户 多对多 关系 ）
2、关注与粉丝的 schems 设计
2.1 数据结构分析 
2.2 把关注设计成用户属性 ，粉丝不设计 
3 restful 粉丝风格的关注粉丝的列表和接口
3.1 关注和粉丝关注接口
4、 id引用
5、取消关注

#### 编写校验用户与否的中间件
1、中间件编写

### 话题模块
#### 一、 话题模块需求分析
功能介绍：
1. 话题的增改查
2. 分页模糊搜索
3. 用户属性的话题引用
4. 关注/取消关注话题 、 用户关注的话题列表

#### 二、restful 风格话题增删改查结构

1、设计schema 
2、实现restful 风格的增改查接口
3、用postman测试接口

#### 三、分页查询
1、实现分页逻辑
2、测试

#### 四、模糊搜索
1、关键词搜索

#### 五、用户属性中的话题引用
1、便于汇总分析
2、所谓话题引用就是id相互指向 具体看文档
[link] http://www.mongoosejs.net/docs/populate.html
3、使用话题引用替代部分用户属性


#### 六 实现关注话题逻辑 ( 用户 - 话题 多对对的关系 )
1、一个用户可以关注多个话题
2、一个话题可以被多个话题关注
3、 这个话题下面的关注者 有多少 其实就是粉丝
4、查询话题有多少粉丝

### 问题模块
1、问题的增删改查
2、用户的问题列表（用户-问题 一对多关系）
3、话题的问题列表 + 问题的话题列表 ( 话题 - 问题 多对多的关系 )
4、关注和取消关注问题

#### 一、用户-问题一对多关系设计与实现
1、实现增删改查接口
2、实现用户的问题列表
3、测试

#### 二、实现多对多
1、问题的话题列表接口
2、实现话题的问题列表接口
3、测试

#### 问题模块功能点
1、问题的增删改查
2、用户的问题列表（用户-问题一对多关系）
3、话题的问题列表+问题的话题列表（话题-问题多对多关系）

用户问题一对多 : 每个用户可以提问多个问题，每个问题只属于一个用户
话题问题多对多实现

简单的说就是一个话题下面有多个问题
一个问题 也包含在多个话题 

实现问题的话题列表接口 和 实现话题的问题列表接口 

### 答案模块
#### 答案模块需求分析
1、增删改查
2、问题-答案  / 用户 -答案一对多
3、赞 / 踩答案
4、收藏答案

#### 答案模块实战
1 问题-答案模块二级嵌套的增删改查接口
2 设计数据库的Schema
3 实现增删改查 测试


#### 互斥关系的赞/踩答案接口设计与实现



#### 收藏答案接口


### 评论模块
#### 评论模块需求分析
1 评论的增删该查 
2 答案-评论/问题 - 评论/用户-评论--- 一对多
3 一级评论与二级评论
4 赞/踩评论

##### 问题-答案 -评论模块三级嵌套的增删改查接口


##### 一级评论与二级评论接口的设计与实现



































