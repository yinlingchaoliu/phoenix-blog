---
title: flutter-boost接入
date: 2024-03-25 22:02:09
category:
  - 跨端技术
tag:
  - archive
---
### 接入flutter boost原因
flutter 没有像RN一样，可以划分为容器+dist形式。
项目需要联合编译。
flutter用dart编写，语法上类java, 选用dart的人，还是很Geek的人。
但是站在业务角度，尽可能不改动别人代码，复用别人业务。给重构找出平滑过渡时间。才是重要的。
所以选型接入flutter_boost。让flutter像webview一样引用

### 配置接入

yaml 配置
```
flutter_boost:
  git:
    url: 'https://github.com/alibaba/flutter_boost.git'
    ref: '4.2.0'
```
dart端集成
```
flutter pub get
```
github 128错误 多重试几次
