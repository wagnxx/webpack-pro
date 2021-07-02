const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { PUBLIC_PATH } = require('./const');

const configs = {
  output: {
    path: __dirname + '/../dist-spa/',
    filename: 'js/[name].[contenthash:4].bundle.js',
    publicPath: PUBLIC_PATH
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // publicPath: '', // 无效
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                cssnano({
                  preset: ['default', {
                    discardComments: {
                      removeAll: true,
                    },
                    // how to find index of all available options?
                  }]
                })
              ]
            }
          },
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[hash:5].css',
      chunkFilename: '[name]-[hash:5].css'
    }),
    new HtmlWebpackPlugin({
      template:'public/template.html'
    })
  ],
  devServer: {
    contentBase: '../dist-spa',
    port: 9001,
    open: true,
    overlay: true,
    stats: 'errors-only',
    before(app) {
      app.get('/api/test', (req, res) => {
        res.json({
          code: 200,
          message:'Hello World'
          })
        })
    }
  }
};
configs.mode = 'development';

module.exports = configs;
