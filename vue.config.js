const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave:false,
  runtimeCompiler : true,
  transpileDependencies: [
    'vuetify'
  ],devServer: {
    proxy: "https://openapi.naver.com"
  }
})
