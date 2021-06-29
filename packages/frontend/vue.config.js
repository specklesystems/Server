module.exports = {
  productionSourceMap: false,
  pages: {
    app: {
      entry: 'src/app.js',
      title: 'Speckle',
      template: 'public/app.html',
      filename: 'app.html'
    },
    embedApp: {
      entry: 'src/embedApp.js',
      title: 'Speckle Embed Viewer',
      template: 'public/embedApp.html',
      filename: 'embedApp.html'
    }
  },
  devServer: {
    host: 'localhost',
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/app.html' },
        { from: /./, to: '/app.html' }
      ]
    }
  },
  transpileDependencies: ['vuetify']
}
