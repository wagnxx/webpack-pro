module.exports = {
  output: {
    path: __dirname + '/dist/',
    filename: 'js/[name].[contenthash:4].bundle.js',
    publicPath: 'https://cdn.example.com/assets/'
  },

  plugins: [
    // new PurgeCSSPlugin({
    //   paths: glob.sync(`../dist/*.html`,  { nodir: true }),
    // }),
  ],
  mode: 'production'
};
