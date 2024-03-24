---
title: Transform-AOP---Transform-API介绍
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---
####起因
最初使用沪江的aspectjx，做click去重出现问题。经过2天仔细排查找到原因，翻阅aspectjx源码,主要采用 transform + aspectj /asm ，发现此类技术解决方案，在应用非常广泛（权限判断，无痕埋点，性能监控，事件防抖，热修复，优化代码），非常有研究价值，网上关于aop研究不够深入，只是简单接入，为了深入学习，项目基于hujiang项目进行改造，来贯穿各个知识点，改造出适应当前项目的aop

####感慨
碎片化知识可以应付项目一时之急，但是不利于长期发展

参考
https://github.com/Qihoo360/ArgusAPM
https://github.com/didi/booster
https://booster.johnsonlee.io
https://github.com/bytedance/ByteX

####app打包过程

####transform介绍

Transform应用场景
1、对编译class文件做自定义处理
2、读取编译class文件信息

Transform API
```


```






####实战项目地址
https://github.com/yinlingchaoliu/TransformAOP
