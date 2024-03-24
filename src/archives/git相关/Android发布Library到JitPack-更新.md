---
title: Android发布Library到JitPack-更新
date: 2024-03-24 11:47:50
category:
  - git相关
tag:
  - archive
---
对应插件库
https://github.com/dcendents/android-maven-gradle-plugin


上传lib库
```
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        // add github maven plugin
        classpath 'com.github.dcendents:android-maven-gradle-plugin:2.1'
    }
}
```

配置仓库
```
//必须是allproject
allprojects {
    repositories {
        jcenter()
        maven { url "https://jitpack.io" } // add this
    }
}
```

引用插件
```
apply plugin: 'com.android.library'
// add these
apply plugin: 'com.github.dcendents.android-maven'
```

script build.gradle 脚本设置参数
```
group = 'com.example'
version = '1.0'
```
artifactId 在 settings.gradle设置
```
rootProject.name = 'artifact'
```

根目录执行脚本
./gradlew install

发布开源库
github 打release tag

https://www.jitpack.io 
引入自己的
eg:
yinlingchaoliu/retrofit-mock-no-op

生成即可
