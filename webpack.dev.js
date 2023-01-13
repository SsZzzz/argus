const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: './test',
    open: true,
    proxy: {
      '/argus': {
        target: 'http://localhost:7001',
      },
    },
  },
});
