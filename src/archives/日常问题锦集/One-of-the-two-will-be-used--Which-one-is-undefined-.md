---
title: One-of-the-two-will-be-used--Which-one-is-undefined-
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---
报错
```
objc[56644]: Class JavaLaunchHelper is implemented in both /Library/Java/JavaVirtualMachines/jdk1.8.0_101.jdk/Contents/Home/bin/java (0x10d52e4c0) 
and /Library/Java/JavaVirtualMachines/jdk1.8.0_101.jdk/Contents/Home/jre/lib/libinstrument.dylib (0x10d5b24e0). 
One of the two will be used. Which one is undefined.
```


1、配置环境变量
```
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home
CLASSPAHT=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
PATH=$JAVA_HOME/bin:$PATH:
export JAVA_HOME
export CLASSPATH
export PATH
```

plan A
配置Intellij Idea
1.打开idea.properties文件 
help->edit custom properties 
添加一句：
```
idea.no.launcher=true
```
2、重启idea

plan B
如果修改Idea配置不生效的话

在Finder 的应用程序中找到IDEA的图标，右键，显式包内容，contents-》bin里面 
```
目录
/Applications/Android Studio.app/Contents/bin/idea.properties
添加
idea.no.launcher=true
```

重启
