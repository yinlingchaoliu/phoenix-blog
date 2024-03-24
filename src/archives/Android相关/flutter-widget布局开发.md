---
title: flutter-widget布局开发
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
widget开发思路

widget 相当于View
开发flutter布局，并不是那么直观
我们用constraintLayout 写法是一层，
对于使用者来言，更直观。
最好的方式就是一层。

最好采用mvp
把逻辑和视图分离
或者类似android-flux效果
这些写起布局清爽，也不用考虑与布局无关的逻辑，
太多widget内私有方法，或者全局变量会导致程序不易读

以往开发baseTemplete效果，
公共titlebar ,公共 theme 公共 frame
公共list列表 可以解决布局大部分需求

理念就是用模板

而不是重复的语法，重复写，项目四处都是
