// 其实该配置就是 mpa 的

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const mode = process.env.NODE_ENV;
const config = require(`./config/${mode}.config.js`);
const { getEntries, getHtmlPlugins } = require('./config/utils');
const entries = getEntries();
const htmlPluginCompose = getHtmlPlugins();

const defaultConfig = {
  entry: {
    ...entries
  },

  plugins: [new webpack.ProgressPlugin(), ...htmlPluginCompose]
};

module.exports = merge(config, defaultConfig);
