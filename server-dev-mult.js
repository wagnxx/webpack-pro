/**
 *
 # 弃用nodemon，nodemon监听是文件modify，而且是只对已经生命的文件有效，进程一旦启动，新增文件无法被监测
 # 改用inotifywait 检测 文件的创建和删除，modify交给webpack自己的watch；（不足：vscode编辑器删除目录文件监听不到）
 # chokidar + clustor 也能满足
 */

const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
var childProcess = require('child_process');
var chokidar = require('chokidar');
const glob = require('glob');
const cluster = require('cluster');

var watcher = chokidar.watch('src/pages');

let server = null;
async function startRenderer() {
  const config = require('./webpack.config');

  config.mode = 'development';

  const options = {
    host: '0.0.0.0',
    useLocalIp: true,
    port: 9000
  };

  webpackDevServer.addDevServerEntrypoints(config, options);

  const compiler = webpack(config);
  if (server) {
    server.close();
    server = null;
  }

  if (server == null) {
    server = new webpackDevServer(compiler, options);
  }
  server.listen(9000, () => {
    console.log('dev server listening jon port 5000');
  });
}
initFiles = glob.sync('src/pages/**');

var log = console.log.bind(console);

function start() {
  if (cluster.isMaster) {
    console.log(`主进程 ${process.pid} 正在运行`);
    let worker = cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
      console.log(`工作进程 ${worker.process.pid} 已退出`);
      worker = cluster.fork();
    });

    watcher.on('addDir', (path) => {
      const isInitialFile = initFiles.includes(path);
      log(
        'Directory',
        path,
        'has been added,is contained initFiles',
        isInitialFile
      );
      if (!isInitialFile) {
        if (worker.isDead()) {
          worker = cluster.fork();
        }
        // dirChanged({ path, type: 'addDir' });
        worker.send(JSON.stringify({ path, type: 'addDir' }));
      }
    });
    watcher.on('unlinkDir', (path) => {
      log('Directory', path, 'has been removed');
      if (worker.isDead()) {
        worker = cluster.fork();
      }
      // dirChanged({ path, type: 'unlinkDir' });
      worker.send(JSON.stringify({ path, type: 'unlinkDir' }));
    });
    watcher.on('erro', (error) => log('Error happened', error));
  } else {
    // 工作进程可以共享任何 TCP 连接。
    // 在本例子中，共享的是一个 HTTP 服务器。

    process.on('message', (msg) => {
      const obj = JSON.parse(msg);
      console.log('worker received msg : ', obj);

      if (obj.type == 'unlinkDir' || 'addDir' == obj.type) {
        process.kill(process.pid, 'SIGHUP');
      }
    });

    console.log(`工作进程 ${process.pid} 已启动`);

    startRenderer();
  }
}

start();
