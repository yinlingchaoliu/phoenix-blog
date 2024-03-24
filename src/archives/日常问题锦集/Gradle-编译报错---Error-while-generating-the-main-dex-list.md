---
title: Gradle-编译报错---Error-while-generating-the-main-dex-list
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---
问题：jar包冲突
查询：gradle  assembleDebug  --stacktrace
定位：Caused by: com.android.tools.r8.errors.CompilationError
```
  compile ("com.facebook.react:react-native:0.55.4") {
        exclude group: 'com.squareup.okhttp3'
    }
```

到module下敲命令：
gradle -q dependencies


//整体移除v4
configurations {
    all*.exclude group: 'com.android.support', module: 'support-v4'
}

转载：
https://blog.csdn.net/stupid56862/article/details/81130589
