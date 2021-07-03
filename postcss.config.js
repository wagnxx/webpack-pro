module.exports = {
  plugins: {
    // "postcss-import": {},
    // "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    autoprefixer: {
      // browsers: 'last 5 version'
    },
    cssnano: {
      //主要用来压缩和清理CSS代码。在Webpack中，cssnano和css-loader捆绑在一起，所以不需要自己加载它。
      'cssnano-preset-advanced': {
        zindex: false,
        autoprefixer: false
      }
    }
  }
};
