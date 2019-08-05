module.exports = {
  pwa: {
    name: "portfolio-app",
    themeColor: "#3EFFD4"
  },

  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3001/api",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },

  configureWebpack: {
    devtool: "source-map"
  },

  lintOnSave: undefined
};
