---
title: Android-apk实战瘦身-立减6M
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
####前言
减少apk体积，实用
根据二八法则，先说效果显著的
####

#####1、包体积分析
打开build–>Analyze APK
对apk体积有一个概况了解

#####2、压缩图片 显著减少体积2.5M
1、优化图片体积 tinypng
先申请[tinypng](https://tinypng.com/)账号,获得api_key

2、点击[AS集成TinyPngPlugin插件配置](https://www.jianshu.com/p/6d375c98c1dc)

#####3、删除冗余so库 语言 减少1.8M
```
defaultConfig {
        resConfigs "zh"
        ndk {
            //设置支持的SO库架构
            abiFilters 'armeabi'
        }   
 }
        
```
#####4、lint删除冗余资源  500k
Android Studio
```
 Analyze -> Run Inspection by Name
选择—>unusedResources  建议第一种
选择—>unused declaration 第二种存在测试量
```

#####5、减少体积标配 500K
```
android {
    buildTypes {
        release {
            minifyEnabled true  //开启minifyEnabled混淆代码
            shrinkResources true //去除无用资源
        }
    }
}
```

#####6、采用AndResGuard 1.3M

点击[AndResGuard实战配置](https://www.jianshu.com/p/1726bfaf1d00)

腾讯方案介绍：[安装包立减1M--微信Android资源混淆打包工具](https://mp.weixin.qq.com/s?__biz=MzAwNDY1ODY2OQ==&mid=208135658&idx=1&sn=ac9bd6b4927e9e82f9fa14e396183a8f#rd)

####未实战方案
####1、so库按需下载
https://github.com/KeepSafe/ReLinker

2、使用WebP文件格式
插件批量处理
https://github.com/meili/WebpConvert_Gradle_Plugin

####参考
[Android性能优化系列之apk瘦身](https://blog.csdn.net/u012124438/article/details/54958757)
