const webpack = require('webpack');
const { merge } = require('webpack-merge');
const mode = process.env.NODE_ENV;
const config = require(`./config/${mode}.spa.config.js`);
const { getEntries, getHtmlPlugins } = require('./config/utils');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();

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

  plugins: [new webpack.ProgressPlugin()]
};

module.exports = smp.wrap(merge(config, defaultConfig));
