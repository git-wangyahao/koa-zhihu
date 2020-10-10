const path = require('path');
class HomeCtl {
  index(ctx) {
    ctx.body = "这是get主页"
  }
  upload(ctx) {
    console.log("basename",ctx.origin)
    const file = ctx.request.files.file
    // 生成预览链接
    const basename = path.basename(file.path);
    ctx.body = { url: `${ctx.origin}/uploads/${basename}` }
  } 
}

module.exports = new HomeCtl()