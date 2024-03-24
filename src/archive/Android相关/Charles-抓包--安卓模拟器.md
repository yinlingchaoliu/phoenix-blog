---
title: Charles-抓包--安卓模拟器
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
#####Charles 抓包
在控制台下，前往以下目录 ../Android/sdk/tools，输入以下命令：

`emulator -avd <your emulator name> -http-proxy http://<your_proxy>`

eg： 
```
emulator -avd Nexus_5X -http-proxy http://172.20.223.78:8888
```
tips:
1、当前网络wifi地址 172.29.223.78
2、Nexus_5X 模拟器名字
3、执行文件目录android/sdk/tools/

如果觉得实用，给点赞👍👍👍
