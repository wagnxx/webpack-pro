const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chalk = require('chalk');

const js = glob.sync('src/pages/**/*.js');
const html = glob.sync('src/pages/**/*.html');

const entriesMap = {};
let htmlmPluginsMap = {};

js.forEach((item) => {
  item.match(/^([\w\/]+)\/([\w\.\-]+)\.js/);
  let parrentPath = RegExp.$1;
  let entryName = RegExp.$2;
  const parrentPathToArray = parrentPath.split('/');
  const parrentFolderName = parrentPathToArray[parrentPathToArray.length - 1];
  const key = parrentFolderName + '-' + entryName;

  entriesMap[key] = resolvePath(item);

  const isHomeIndex = parrentFolderName === 'home' && entryName === 'index';
  let _searchtempPath = parrentPath + '/' + entryName + '.html';
  let _newKey = key.replace('.template', '');
  let _template = 'public/index.html'; //默认公共模块

  if (entriesMap[_newKey] && item.indexOf('.template.') > -1) {
    dealLog(item);
    _newKey = key;
  }

  if (html.includes(_searchtempPath)) {
    _template = _searchtempPath;
  }

  htmlmPluginsMap[key] = {
    chunk: _newKey,
    isHomeIndex: isHomeIndex,
    template: _template
  };
});

function dealLog(item) {
  const warning = chalk.keyword('orange');
  console.log(warning('!!!!!!!!!!!!!!'));
  throw new Error(item + '文件已经存在了，请更名');
}

const htmlPluginCompose = Object.values(htmlmPluginsMap).map(
  (item) =>
    new HtmlWebpackPlugin({
      template: item.template,
      filename: item.isHomeIndex ? 'index.html' : item.chunk + '.html',
      inject: 'body',
      chunks: [item.chunk]
    })
);

module.exports = {
  getEntries() {
    return entriesMap;
  },
  getHtmlPlugins() {
    return htmlPluginCompose;
  }
};

function resolvePath(relativePath) {
  return path.resolve(__dirname, '..', relativePath);
}
