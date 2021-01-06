const path =require ('path') //引入一个path模块，是nodejs的一个模块，可以用来做path

module.exports = {
  lintOnSave: false,
  // devServer: {
  //   proxy:{
  //     '/api': {
  //       // target: 'http://192.168.11.240:8080/topcheer',
  //       target: 'http://192.168.30.220:8080/topcheer',
  //       // target: 'http://192.168.99.132:8080/topcheer',
  //       ws: true,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': '/', // rewrite path
  //       },
  //     },
  //   }
  // },
  chainWebpack: config =>{
    const dir = path.resolve(__dirname, 'src/assets/icons')
//确定icon所在的目录，__dirname当前目录的意思
    config.module
      .rule('svg-sprite')  //规则名称
      .test(/\.svg$/)  //匹配此正则的文件（以.svg结尾的文件），但是这样写是整个文件里面匹配的都会找到
      .include.add(dir).end() // 包含 icons 目录
      //匹配loader
      .use('svg-sprite-loader').loader('svg-sprite-loader').options({extract:false}).end()
    //匹配插件
    config.plugin('svg-sprite').use(require('svg-sprite-loader/plugin'), [{plainSprite: true}])
    config.module.rule('svg').exclude.add(dir)// 其他 svg loader 排除 icons 目录
  }

}
