const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  // publicPath: process.env.NODE_ENV === "production" ? "/dist/" : "/",
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: productionGzipExtensions,
        threshold: 4096, // 只压缩 4k 以上的资源
        minRatio: 0.8,
        deleteOriginalAssets: process.env.NODE_ENV === 'production', // 压缩之后删除文件，development模式下设为 true 会报错
      }),
    ],
    // 打包忽略第三方库，采用 cdn 方式引入
    externals: {
      vue: "Vue",
      "vue-router": "VueRouter",
      // element-ui 按需引入后，cdn 方式引入不起作用
      "element-ui": "ELEMENT",
      axios: "axios",
    },
  },
});
