---
title: retrofit-mock-无入侵式mock框架
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---

####导航
[1、retrofit-mock用法](https://www.jianshu.com/p/52df6aa67a5f)
[2、retrofit-mock编写思路(aop)](https://www.jianshu.com/p/9ef526b30b9c)
[3 、retrofit-mock的动态代理及注解](https://www.jianshu.com/p/48fa1ad00084)
4、aspect 原理讲解与注解语法 

#####1、前言
retrofit作为网络核心框架，作为基础库。
针对retrofit有很多封装，并不会有很多机会，稳定项目进行二次封装，添加mock代码，这样会造成程序的整体不稳定，增加测试难度，通常如下：
```
var api = createMocker(service, retrofit) 
```
所以需要开发一款无入侵式mock工具，随时挂载mock和卸载mock的框架

目前retrofit-mock框架功能
```
1、mock框架无入侵式注入，不需要修改原有网络代码
2、mock框架正式生产包，不会有效率影响
3、支持注解配置，不需要额外代码，生产代码与测试代码一致
4、支持http，本地json，同时兼容适配retrofit2.5.0版本
```

######问题反馈解答：
* 1、mock库在debug包生效，release包失效，想使用mock效果，请用debug包

* 2、写mock库目的：生产包和测试包用同一份代码，不需要额外修改

* 3、mock在debug生效，release包失效原理：retrofit-mock库是mock真正实现代码，retrofit-mock-no-op库是空实现。如果你希望release包生效，请引用retrofit-mock库

#####2、retrofit-mock用法

* 1、用法
```
/**
 * MOCK 有两种写法
 * mock http地址
 * mock 本地json数据
 */
public interface Api {

    @MOCK(value = "appversion/update.json",enable = true)
    @GET(Urls.UPDATE_INTERFACENAME)
    Observable<BaseDataBean<IsUpdateBean>> getUpdateInfo();

    @MOCK(value = "https://www.baidu.com", enable = false)
    @GET(Urls.UPDATE_INTERFACENAME)
    Observable<BaseDataBean<IsUpdateBean>> getUpdateInfo2();
}
```
如上两种用法

enable 是当前接口是否mock的开关

为了便于易用
```
//RetrofitMock 是mock的所有接口的总开关
RetrofitMock.setEnabled( true ); 
//针对于debugRelease
```

* 2、retrofit-mock的依赖
```
dependencies{
    debugImplementation 'com.github.yinlingchaoliu:retrofit-mock:1.0.1'
    releaseImplementation 'com.github.yinlingchaoliu:retrofit-mock-no-op:1.0.1'
}

//aop开启
aspectjx {
    enabled true
}
```

```
allprojects {
    repositories {
        maven { url 'https://www.jitpack.io' }
    }
}
```

引用aop插件
```
//引入插件
buildscript {
    dependencies {
        classpath 'com.hujiang.aspectjx:gradle-android-plugin-aspectjx:2.0.4'
    }
}
添加对应依赖
apply plugin: 'android-aspectjx'
```

增加混淆
```
####retrofit-mock
-keep class retrofit2.** {*;}
-keep class com.chaoliu.mock.** {*;}
```

#####4、特别感谢
首先特别感谢[javalong](https://www.jianshu.com/p/ef445d5e9be0),给retrofit-mock提供了好的思路

本文代码
https://github.com/yinlingchaoliu/retrofitMock
