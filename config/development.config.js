const path = require('path');
const glob = require('glob-all');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const { PUBLIC_PATH } = require('./const');

const configs = {
  devtool: "source-map" ,
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
                // presets: ['@babel/preset-env', '@babel/preset-react']
                presets: ['latest','@babel/preset-react']
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
    }),
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
    port: 9000,
    open: true,
    overlay: true,
    inline:true,
    stats: 'errors-only'
  }
};
configs.mode = 'development';

module.exports = configs;
