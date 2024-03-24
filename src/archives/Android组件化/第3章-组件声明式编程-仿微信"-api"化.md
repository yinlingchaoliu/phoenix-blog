---
title: 第3章-组件声明式编程-仿微信"-api"化
date: 2024-03-24 11:47:50
category:
  - Android组件化
tag:
  - archive
---
今天终于方案研究出来了，双击666
####导航
[第3章 组件声明式编程 仿微信".api"化(上)](https://www.jianshu.com/p/20108abc1dd6)
[第3章 仿微信".api"化 实现原理（下）](https://www.jianshu.com/p/b5b8afd008b3)

#####1、背景
[微信Android模块化架构重构实践](https://mp.weixin.qq.com/s/6Q818XA5FaHd7jJMFBG60w)，在腾讯文章中提到“.api”解决方案
原文介绍位置，建议读此文读者反复读这个位置
```
--重塑模块化
    --改变通信方式
        --接口暴露
```
难点：技术难点卡在如何创造这两个函数上来支持这个功能
```groovy
include_with_api(project:":plugin-messenger-foundation")//初始化项目
dependencies{
      compileApi(":plugin-messenger-foundation")//引入项目依赖
}
```

“.api”化的功能，强大在于，在编译的时候，子组件将公用接口下沉到基础库，供其他module使用，而不会导致base module急剧增大，分工职责更加明确化
效果==>使用效果前![](https://upload-images.jianshu.io/upload_images/5526061-b13f7f51bbacc388.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
使用效果后==>![](https://upload-images.jianshu.io/upload_images/5526061-bc174451c7fe01bd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
其中“.api”立下承担50%效果

#####2、编写的思想
声明式编程：将模块中代码拆分为“声明+实现”，其他模块只需要引用声明即可。
微信的方案，只留了一个遐想空间“自动生成一个sdk工程，拷贝.api后缀文件到工程当中，后面其他工程依赖编译的只是这个生成工程，简单好用”
解决方案是那两个函数include_with_api，compileApi，此时感受到一万点暴击

经过了一周的钻研已经攻克了，先从使用教程，再到原理分析

#####3使用教程

在根目录下build.gradle
```groovy
buildscript{
  dependencies {
    //本插件代码已上传jcenter ，下载记得翻墙
    classpath 'com.chaoliu:weixinApi:1.0.0' 
  }
    repositories {
        jcenter()
    }
}

//gradle 脚本尾部
apply plugin: 'weixinApi'
```

gradle.properties 声明
```
##支持声明api式编程
##引用的moudle
ApiModule=':module_api'
##是否每次都执行 未配置此属性 默认为true 
isRunAlways=true
```

支持weixinapi脚本自动触发，且有良心提示

![组名weixinapi，且有良心提示](https://upload-images.jianshu.io/upload_images/5526061-dbbfc90ed27021d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

settings.gradle  正常写法
```
//api testmodule 为lib库
include ':module_api'
```

若有module采用".api"方式开发
引入公共ApiModule即可

`特别提供addComponent 函数，只有在assemble任务才引入依赖`
开发中避免本moudle引入过多其他module声明

```
    //和正常开发无任何变化
    implementation project(':module_api')

    // addComponent(':module_api')
```

如果想编辑.api后缀的java文件，为了能让Android Studio继续高亮该怎么办？可以在File Type中把.api作为java文件类型。

![设置File Types](https://upload-images.jianshu.io/upload_images/5526061-8db9432c8a99af18.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#####4、喜欢的朋友们记得给我的项目一个star
https://github.com/yinlingchaoliu/AndroidComponent
具体代码位置去".api"插件
component/weixinApi

示例module
module_main ,module_girls

下一篇进行原理分析，如何进行操作，解决这个问题
