---
title: Android-一键发布到jcenter
date: 2024-03-24 11:47:50
category:
  - git相关
tag:
  - archive
---
######前言
本打算用groovy脚本写一个插件来实现，
groovy 引用classpath 其他插件时临时遇到瓶颈
先按照网络上流行方法解决


#####1、使用方式

* 1、下载脚本，并放在根目录
https://raw.githubusercontent.com/yinlingchaoliu/android-library-publish-to-jcenter/master/upload.gradle

* 2、在gradle.properties 引入公共配置
```
####github地址
siteUrl=https://github.com/yinlingchaoliu/robolectric-plugin
gitUrl=https://github.com/yinlingchaoliu/robolectric-plugin.git

//开发者信息
developerId=yinlingchaoliu
developerName=tong.chen
developerEmail=704514698@qq.com
```

* 3、在需要打aar库下引入特定配置
```
ext {
    publishedGroupId='com.chaoliu.abcdef'
    artifact = 'plugin'
    publishedVersion = "0.2.2"
    libraryDescription = 'A Robolectric Plugin for android unit'
} 

//引入 需要打aar的module下build.gradle
apply from '../upload.gradle'
```

根目录下 build.gradle
```
buildscript {

    repositories {
        google()
        jcenter()
    }
    dependencies {
        // 增加classpath
        classpath 'com.jfrog.bintray.gradle:gradle-bintray-plugin:1.2'
        classpath 'com.github.dcendents:android-maven-gradle-plugin:1.5'
    }
}
```

在local.properties 设置对应的参数即可
```
bintray.user=xxx
bintray.apikey=xxx
bintray.gpg.password=xxx
```


1、upload.gradle经过优化的，将公共的抽取出来。
不会导致每个脚本写的很乱。

2、建议artifact和moudle名字是一样的，减少很多不必要的麻烦和配置

3、上传代码需要vpn支持
执行命令
gradle  :module:install
gradle  :module:bintray


#####源代码地址
https://github.com/yinlingchaoliu/android-library-publish-to-jcenter

参考
https://github.com/panpf/android-library-publish-to-jcenter

注册bintray
https://blog.csdn.net/wzgiceman/article/details/53707042

脚本问题修复 参考
https://www.cnblogs.com/dream-sky/p/5640533.html
