---
title: 编写aspectj插件-重写Hugo
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---


1、前言
Hugo 是JakeWharton写的性能检测框架
原理是利用aspectj Aop切片编程，拦截注解方法，在Around中对方法进行操作

由于aspectj 引入gradle配置比较麻烦，jakeWharton将注解及对应AspectJ方法实现，和对应插件放在一起。

我这边是把aspectJ插件专门抽出来，后续再有aop的任务，扩展会比较简单。

引入aspectj插件方法

```
主build.gradle
apply plugin: 'com.chaoliu.aspectj'
aspectj {
    enabled true //注解是否生效
    isCompile true //aspectj是否complie引入
}

buildscript {    
    dependencies {
        classpath fileTree(dir: 'plugins', include: ['*.jar'])
        classpath 'org.aspectj:aspectjtools:1.8.6'
     }
}

```
aspectj便引入完毕了。

DebugLog
没有任何改变，用法不变

详细见代码
https://github.com/yinlingchaoliu/aspectjx
