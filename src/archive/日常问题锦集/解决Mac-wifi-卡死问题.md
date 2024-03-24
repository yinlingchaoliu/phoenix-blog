---
title: 解决Mac-wifi-卡死问题
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---
点击命令行
```
ps -ef | grep  airportd
```
显示进程号：57964
```
0 57964     1   0 12:27下午 ??         0:01.45 /usr/libexec/airportd
```
杀死进程 57964
```
sudo kill -9   57964(进程号)
```
