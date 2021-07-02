# 关于vscode的快捷键的简单收集

- vscode自身
  + Alt: menu toggle
  + Ctrl+B: sideBar toggle
  + Ctrl+P: 选择打开文件
  + Ctrl+Shift+P:弹出输入框,输入目标action,操作更复杂的动作
  
- Advanced new File插件
  + Ctrl+N: 创建文件(选择路径,输入文件夹名)  ,原来默认的创建文件 改成 "Ctrl+U Ctrl+N" (:U代表unknown place,default action)

- File Utils 插件
  + 主要帮助文件的 rename,delete,move等操作
  + 快捷键是 借助vscode自身的 "Ctrl+Shift+P" 当输入框出现时输入目标行为


## Vscode 插件
- advanced-new-file
- auto rename tag
- ES7 React/Redux/GraphQL/React-Native snippets
- File Utils
- import cost
- live Server
- Markdown PDF
- Prettier - code formatter
- Sublime Text Keymap
- Trailing Spaces
- Vetur
- vscode-icons
- vscode-Counter
- rest Client



## 在线ｐｓ　好用字体
－　 source Han serif K

# 项目说明

该项目主要是通过webpack对mpa的搭建，spa可以忽略，在该项目主要看重项目搭建思路和配置，初始化完后期慢慢弥补

# 项目配置
webapck.config.js,webpack.config.mpa 为多页
webpack.config.spa 为单页 （教上面没什么区别，只是多了开发期间的几个插件）

## webpack 常见的插件

- html-webpack-plugin
- clean-webpack-plugin
- extract-text-webpack-plugin 已过时，现在用mini-css-extract-plugin,使用时不能用cssModule
- copy-webpack-plugin

- uglifyJs-webpack-plugin
- happyPack
- compression-webpack-plugin
- optimize-css-assets-webpack-plugin

- D: speed-measure-webpack-plugin
- D: progress-bar-webpack-plugin
- D: webpack-dashboard
- D: webpack-deep-scope-analysis  

## 优化
- nano 对css 进行hint
- es6不用编译  cdn.polify.io
- manifestPlugin




### 基础知识
- lodash 和lodash-es区别
  + lodash-es可以结构引入，方便按需引入，减少boundle体积
  + lodash不可以结构，体积很大
- purgecss-webpack-plugin: css treeShaking


## 异同
- css-module  ： 在SPA中可以使用 ，
  + 使用方法： ‘css-loader?modules&localIdentName=[name]_[local]-[hash:base64:4]’
