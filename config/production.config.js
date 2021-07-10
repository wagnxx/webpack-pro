const PurgecssPlugin = require('purgecss-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const glob = require('glob-all');
const fs = require('fs');
module.exports = {
  output: {
    path: __dirname + '/../dist/',
    filename: 'js/[name].[contenthash:4].bundle.js',
    publicPath: '/'
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
          //   loader: 'postcss-loader',
          //   options: {
          //     plugins: [require('autoprefixer'), require('cssnano')]
          //   }
          // }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:5].css',
      chunkFilename: '[name]-[contenthash:5].css'
    }),
    new PurgecssPlugin({
      paths: glob.sync(
        [
          `${path.resolve(__dirname, '..', 'src')}/**/*.js`,
          `${path.resolve(__dirname, '..', 'src')}/**/*.html`,
          `${path.resolve(__dirname, '..', 'src')}/**/*.jsx`,
          `${path.resolve(__dirname, '..', 'node_modules')}/**/*`
          // 'src/**/*'
          // path.resolve(__dirname, 'node_modules/jquery/dist/jquery.slim.js'),
          // path.resolve(__dirname,'..', 'node_modules/bootstrap/dist/js/bootstrap.bundle.js'),
        ],
        {
          nodir: true
        }
      )
    })
  ],
  // externalsType: 'script',
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM'
  // },
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
  mode: 'production'
};
