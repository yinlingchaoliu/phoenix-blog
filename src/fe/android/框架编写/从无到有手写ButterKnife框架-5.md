---
title: 从无到有手写ButterKnife框架-5
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---
#####导航
一、[代码的演进](https://www.jianshu.com/p/a96de1aa4e29)
二、[butterKnife反射调用](https://www.jianshu.com/p/f8856e913224)
三、[javapoet自动生成模板代码](https://www.jianshu.com/p/cdf417e52cab)
四、[apt与注解](https://www.jianshu.com/p/43eb69b2beeb)
五、[注解支持多层继承](https://www.jianshu.com/p/a91cbfb8b1a1)
六、[apt调试](https://www.jianshu.com/p/8418ef144b29)
七、[javapoet语法](https://www.jianshu.com/p/2da1ca9d8ffa)

#####1、apt Debug调试

1、在项目的根目录下的gradle.properties文件中，新增如下配置：
```
org.gradle.jvmargs=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005
```

2、新建remote debugger
命名为AnnotationProcessor
![](https://upload-images.jianshu.io/upload_images/5526061-25f1806cf0a1b873.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3、设置断点执行命令
先clean 后compileDebugSources
![](https://upload-images.jianshu.io/upload_images/5526061-88e366fa001fcf4e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

4、debug操作
从左往右
![](https://upload-images.jianshu.io/upload_images/5526061-db1eb5235747b9f0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
【下一行】【进入方法内】【强行进入】【退出方法内】【略过...】【下一个断点】

#####从无到有手写butterKnife框架
https://github.com/yinlingchaoliu/JavaPoetDemo
