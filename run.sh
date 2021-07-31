NODE_ENV=development webpack serve  --inline --config webpack.config.js

# NODE_ENV=development nodemon --exec ' webpack serve  --inline --config webpack.config.js '

# 弃用nodemon，nodemon监听是文件modify，而且是只对已经生命的文件有效，进程一旦启动，新增文件无法被监测
# 改用inotifywait 检测 文件的创建和删除，modify交给webpack自己的watch

# NODE_ENV=development webpack serve  --inline --config webpack.config.js