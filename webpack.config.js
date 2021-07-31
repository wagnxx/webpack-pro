// 其实该配置就是 mpa 的

const webpack = require('webpack');
const { merge } = require('webpack-merge');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const mode = process.env.NODE_ENV;
const config = require(`./config/${mode}.config.js`);
const { getEntries, getHtmlPlugins } = require('./config/utils');
const entries = getEntries();
const htmlPluginCompose = getHtmlPlugins();
// const WebpackWatchedGlobEntries = require('./config/plugins/webpack-watch-mult-entry-plugin');
const defaultConfig = {
  entry: {
    ...entries
  },
  resolve: {
    // 要解析的文件的扩展名
    extensions: ['.js', '.jsx', '.json'],
    // 解析目录时要使用的文件名
    mainFiles: ['index']
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new ProgressBarPlugin(),
    // new WebpackWatchedGlobEntries(),
    ...htmlPluginCompose,
    function() {
      this.hooks.done.tap('done', (stats) => {
          if (stats.compilation.errors &&
              stats.compilation.errors.length && 
              process.argv.indexOf('--watch') == -1)
          {
              console.log('Webpack ：build error');
              process.exit(1);
          }
      })
    }
  ]
};

module.exports = merge(config, defaultConfig);


process.on('error', e => {
  console.log("webpack.config capture Erro:",e)
})