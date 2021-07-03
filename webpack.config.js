// 其实该配置就是 mpa 的

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const mode = process.env.NODE_ENV;
const config = require(`./config/${mode}.config.js`);
const { getEntries, getHtmlPlugins } = require('./config/utils');
const entries = getEntries();
const htmlPluginCompose = getHtmlPlugins();
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

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
    new webpack.ProgressPlugin(),
    new ProgressBarPlugin(),
    ...htmlPluginCompose
  ]
};

module.exports = merge(config, defaultConfig);
