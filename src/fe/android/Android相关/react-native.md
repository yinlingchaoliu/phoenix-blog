---
title: react-native
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
教程
https://reactnative.cn

推荐开源项目
https://github.com/CarGuo/GSYGithubApp

从上到下执行命令
brew install node
brew install watchman //监视文件系统变更的工具

官方不建议cnpm
注意：不要使用 cnpm！cnpm 安装的模块路径比较奇怪，packager 不能正常识别！

npm config set registry https://registry.npm.taobao.org --global
npm config set disturl https://npm.taobao.org/dist --global

npm install -g yarn react-native-cli

yarn config set registry https://registry.npm.taobao.org --global
yarn config set disturl https://npm.taobao.org/dist --global


npm install  ==yarn
npm install  plugin ==yarn add plugin
 
npm install 

npm audit fix

创建项目
react-native init AwesomeProject

`warning 需要手动开启模拟器 
不能有耗时操作，比如下载gradle.zip 下载第三方库`

react-native run-ios 
react-native run-android
react-native run-android --variant=release

目录分析
package.json 依赖
index.js 首个js
app.json 应用名称

App.js 
