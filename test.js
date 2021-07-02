html = ['src/pages/home/home-sub.html', 'src/pages/home/index.html'];

js = [
  'src/pages/home/home-sub.js',
  'src/pages/home/index.js',
  'src/pages/home/sub2.template.js',
  'src/pages/view/index.template.js'
];
const entries = {};
let htmlmPlugins = {};
js.forEach((item) => {
  item.match(/^([\w\/]+)\/([\w\.\-]+)\.js/);
  let parrentPath =RegExp.$1
  let entryName =RegExp.$2
  // console.log(RegExp.$1, RegExp.$2);
  const pa = parrentPath.split('/');
  const folderName = pa[pa.length-1]
  const key = folderName + '-' + entryName;
 
  entries[key] = item;

  if (entryName.indexOf('template') > -1) {
    htmlmPlugins[key] = {
      chunk: key,
      template:0 //默认公共模块
    }; // 选公共模块

  } else {
    let _tempPath = parrentPath + '/' + entryName + '.html';
    if (html.includes(_tempPath)) {
      htmlmPlugins[key] = {
        chunk: key,
        template:_tempPath
      };
    }
    // console.log('用template的文',entryName)
  }
  
});
console.log('entries :', entries);
console.log('pluginhtml: ',Object.values(htmlmPlugins))