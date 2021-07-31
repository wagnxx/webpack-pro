

# NODE_ENV=development nodemon --exec ' webpack serve  --inline --config webpack.config.js '

# 弃用nodemon，nodemon监听是文件modify，而且是只对已经生命的文件有效，进程一旦启动，新增文件无法被监测
# 改用inotifywait 检测 文件的创建和删除，modify交给webpack自己的watch


# NODE_ENV=development webpack serve  --inline --config webpack.config.js

# 监视的文件或目录
filename=./src/pages
script=./run.sh

start() {

  count=$(lsof -ti:9000 | wc -l)
  pids=$(lsof -ti:9000)
  echo "pids : $pids"

  if [ $count -ne 0 ]; then
    echo 'already running ，kill it'
    for i in $pids; do
      kill -9 $i
      echo "pid: $i success"
    done
    bash $script

  else
    echo 'not running，start to worker'
    bash $script
  fi

}

restart() {
  # echo "file name is: $0"
  echo "file change event : $1"
  echo 'restart Webpack server to build'

  start
}

start

inotifywait -mrq --format '%e' --event create,delete $filename | while read event; do
  case $event in CREATE | DELETE) restart $event ;;
  esac
done
