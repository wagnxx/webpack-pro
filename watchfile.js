var childProcess = require('child_process');
var chokidar = require('chokidar');

var watcher = chokidar.watch('src/pages');

var exec = childProcess.exec;
var spawn = childProcess.spawn;
var log = console.log.bind(console);
var cmd = 'NODE_ENV=development webpack serve  --inline --config webpack.config.js';
exec(" npm run list", (err, stdout, stderr) => {
  if (err) {
    console.log(stderr);
    process.exit(1);
    return;
  }
  console.log(stdout)
})

// watcher
//   .on('add', (path) => log('File', path, 'has been added'))
//   .on('addDir', (path) => {
//     log('Directory', path, 'has been added');
//   })
//   .on('change', (path) => log('File', path, 'has been changed'))
//   .on('unlink', (path) => log('File', path, 'has been removed'))
//   .on('unlinkDir', (path) => log('Directory', path, 'has been removed'))
//   .on('erro', (error) => log('Error happened', error))
//   .on('ready', () => log('initial scan complte,ready for changes'))
//   .on('raw', (event, path, details) =>
//     log('Raw event info:', event, path, details)
//   );

/**
  
  File src/pages/view/utils/utils.js has been added
initial scan complte,ready for changes
Raw event info: rename lesspage { watchedPath: 'src/pages' }
Raw event info: rename lesspage { watchedPath: 'src/pages/lesspage' }
Directory src/pages/lesspage has been removed
File src/pages/lesspage/index.js has been removed
Raw event info: rename test { watchedPath: 'src/pages' }
Raw event info: rename test { watchedPath: 'src/pages/test' }
Directory src/pages/test has been removed
File src/pages/test/index.js has been removed
Raw event info: rename lesspage { watchedPath: 'src/pages' }
Directory src/pages/lesspage has been added
Raw event info: rename index.js { watchedPath: 'src/pages/lesspage' }
File src/pages/lesspage/index.js has been added
Raw event info: rename index.js { watchedPath: 'src/pages/lesspage' }
Raw event info: rename index.js { watchedPath: 'src/pages/lesspage/index.js' }
File src/pages/lesspage/index.js has been removed
Raw event info: rename lesspage { watchedPath: 'src/pages' }
Raw event info: rename lesspage { watchedPath: 'src/pages/lesspage' }
Directory src/pages/lesspage has been removed

  
  */
