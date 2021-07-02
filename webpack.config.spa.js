const webpack = require('webpack');
const { merge } = require('webpack-merge');
const mode = process.env.NODE_ENV;
const config = require(`./config/${mode}.spa.config.js`);
const { getEntries, getHtmlPlugins } = require('./config/utils');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const DashboardPlugin = require('webpack-dashboard/plugin');
const Notifier = require('build-notify-webpack-plugin');
const defaultConfig = {
  entry: {
    index: './spasrc/index'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          name: 'common',
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },

  plugins: [
    // new webpack.ProgressPlugin(),
    new DashboardPlugin(),
    new ProgressBarPlugin(),
  
  ]
};
module.exports = merge(config, defaultConfig);
