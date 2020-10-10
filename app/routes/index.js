const fs = require('fs');

// fs.readdirSync 读取文件夹
module.exports = (app) => {
  fs.readdirSync(__dirname).forEach( file => {
    console.log(file)
    if (file === 'index.js') {
      return
    }
    const route = require(`./${file}`);
    app.use(route.routes()).use(route.allowedMethods())
  })
}