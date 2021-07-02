const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const js = glob.sync('src/pages/**/*.js');
const html = glob.sync('src/pages/**/*.html');

const entries = {};
let htmlmPlugins = {};
js.forEach((item) => {
  item.match(/^([\w\/]+)\/([\w\.\-]+)\.js/);
  let parrentPath = RegExp.$1;
  let entryName = RegExp.$2;
  // console.log(RegExp.$1, RegExp.$2);
  const pa = parrentPath.split('/');
  const folderName = pa[pa.length - 1];
  const key = folderName + '-' + entryName;

  entries[key] = resolvePath(item);

  const isHomeIndex = folderName === 'home' && entryName === 'index';

  if (entryName.indexOf('template') > -1) {
    htmlmPlugins[key] = {
      chunk: key,
      isHomeIndex:isHomeIndex,
      template: 'public/index.html' //默认公共模块
    }; // 选公共模块
  } else {
    let _tempPath = parrentPath + '/' + entryName + '.html';
    if (html.includes(_tempPath)) {
      htmlmPlugins[key] = {
        chunk: key,
        isHomeIndex:isHomeIndex,
        template: _tempPath
      };
    }
    // console.log('用template的文',entryName)
  }
});

const htmlPluginCompose = Object.values(htmlmPlugins).map((item) => {

  const filename = item.isHomeIndex ? 'index.html' : item.chunk + '.html';
  
  return new HtmlWebpackPlugin({
    template: item.template,
    filename: filename,
    inject: 'body',
    chunks: [item.chunk]
  });
});

module.exports = {
  getEntries() {
    return entries;
  },
  getHtmlPlugins() {
    return htmlPluginCompose;
  }
};

function resolvePath(relativePath) {
  return path.resolve(__dirname, '..', relativePath);
}
