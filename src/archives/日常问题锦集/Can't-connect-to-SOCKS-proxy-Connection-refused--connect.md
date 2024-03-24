---
title: Can't-connect-to-SOCKS-proxy-Connection-refused--connect
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---
Can't connect to SOCKS proxy:Connection refused: connect

如上报错，原因是AS设置了代理，可找到项目相面的gradle.properties这个文件，恢复成新建项目内容一致即可
删除这个配置
systemProp.http.proxyHost=127.0.0.1systemProp.http.proxyPort=1080
