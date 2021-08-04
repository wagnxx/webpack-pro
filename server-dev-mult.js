/**
 *
 # 弃用nodemon，nodemon监听是文件modify，而且是只对已经生命的文件有效，进程一旦启动，新增文件无法被监测
 # 改用inotifywait 检测 文件的创建和删除，modify交给webpack自己的watch；（不足：vscode编辑器删除目录文件监听不到）
 # chokidar + clustor 也能满足
 */

const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const chokidar = require('chokidar');
const glob = require('glob');
const cluster = require('cluster');

const watcher = chokidar.watch('src/pages');

let log = console.log.bind(console);
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
  server.listen(9000);
}
let initFiles = glob.sync('src/pages/**');


function start() {
  if (cluster.isMaster) {
    log(`主进程 ${process.pid} 正在运行`);
    let worker = cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
      log(`工作进程 ${worker.process.pid} 已退出`);
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

    process.on('message', (msg) => {
      const obj = JSON.parse(msg);
      log('worker received msg : ', obj);

      if (obj.type == 'unlinkDir' || 'addDir' == obj.type) {
        process.kill(process.pid, 'SIGHUP');
      }
    });

    log(`工作进程 ${process.pid} 已启动`);

    startRenderer();
  }
}

start();
