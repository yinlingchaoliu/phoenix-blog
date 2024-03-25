---
title: ASM手册-语法简介
date: 2024-03-25 22:02:09
category:
  - gradle插件
tag:
  - archive
---
####1、动机
* 1、为了效率
asm操作字节码是最快的，javassist cglib 基于此开发的。so 为了更极致获得速度和效率
* 2、插桩技术
插桩技术很大程度用到此项技术，
* 3、追求极致
技术进阶，升级打怪必经之路

#### 2、简洁文档
目标：简洁易用

#####包路径划分
org.objectweb.asm
-->signature 基于事件 , 类分析和写入
-->util  开发调试
-->common 类转换器
-->tree.anysis 分析

#####visit拜访者设计模式
优点：便于快速访问
缺点：不易理解设计模式之一
