const path = require('path');
const glob = require('glob-all');
const fs = require('fs');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const { PUBLIC_PATH } = require('./const');
const server = require('./server');

const configs = {
  devtool: 'source-map',
  output: {
    path: __dirname + '/../dist/',
    filename: 'js/[name].[contenthash:4].js',
    publicPath: PUBLIC_PATH
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['transform-object-rest-spread'],
            presets: [
              // '@babel/preset-env',
              '@babel/preset-react',
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: ['last 2 chrome versions']
                  }
                }
              ]
            ]
          }
        }
      },
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
          'postcss-loader'
          // {
          // loader: 'postcss-loader',
          // options: {
          //   plugins:devMode?[require('autoprefixer')]
          //     :[require('autoprefixer'), require('cssnano')]
          // }
          // }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:5].css',
      chunkFilename: '[name]-[contenthash:5].css'
    })
    // new PurgecssPlugin({
    //   paths: glob.sync(
    //     [
    //       `${path.resolve(__dirname, '..', 'src')}/**/*`
    //       // 'src/**/*'
    //       // path.resolve(__dirname, 'node_modules/jquery/dist/jquery.slim.js'),
    //       // path.resolve(__dirname,'..', 'node_modules/bootstrap/dist/js/bootstrap.bundle.js'),
    //     ],
    //     {
    //       nodir: true
    //     }
    //   )
    // })
  ],
  devServer: {
    contentBase: '../dist',
    host: '0.0.0.0',
    port: 9000,
    open: true,
    overlay: true,
    inline: true,
    stats: 'errors-only',
    https: {
      key: fs.readFileSync('cert/private.key'),
      cert: fs.readFileSync('cert/mydomain.crt')
    },
    before(app) {
      const browserify = require('browserify-middleware');
      // ...
      app.get('/js/simple-peer.js', browserify(['simple-peer']));
    }
  }
};
configs.mode = 'development';

module.exports = configs;
