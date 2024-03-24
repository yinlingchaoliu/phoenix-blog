---
title: Android-Studio-解决resolve-dependencies-'classpath'卡住
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---
一、代理问题

gradle.properties设置两行

systemProp.http.proxyHost=127.0.0.1
systemProp.http.proxyPort=2273

systemProp.https.proxyHost=127.0.0.1
systemProp.https.proxyPort=2273

二、编译器问题
google官网换最新AndroidStudio
