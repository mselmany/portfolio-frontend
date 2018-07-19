module.exports = {
  pwa: {
    name: "portfolio-app"
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
  }
};
