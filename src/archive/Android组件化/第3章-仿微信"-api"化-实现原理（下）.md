---
title: 第3章-仿微信"-api"化-实现原理（下）
date: 2024-03-24 11:47:50
category:
  - Android组件化
tag:
  - archive
---
####导航
[第3章 组件声明式编程 仿微信".api"化(上)](https://www.jianshu.com/p/20108abc1dd6)
[第3章 仿微信".api"化 实现原理（下）](https://www.jianshu.com/p/b5b8afd008b3)

#####1、思考路径
将原本下沉到base模块的通用性不高的代码，被重新申领到各个业务模块，运行时动态放入到base模块，在项目不断扩大时，避免了base在后期开发时急速膨胀，约束好代码边界

反复参考[微信Android模块化架构重构实践](https://mp.weixin.qq.com/s/6Q818XA5FaHd7jJMFBG60w)思想，忽然有一个灵感，“.api”文件是java JVM不识别的，可不可以在编译之前，将这些".api"文件变成系统可识别的。weixinapi，是这个插件由来的原因

##### 2、代码实现的核心逻辑
1、将项目中所有module中".api"文件拷贝至指定ApiModule
2、因为java jvm不识别".api"文件，将ApiModule中“.api”文件后缀改为".java"
3、同理，将原来所有module中".api"文件编译时移除使用（exclude）
4、清理ApiModule中空文件夹，使该项目显得更加清晰

##### 3、示例核心代码 gradle脚本编写
1、删除api_module中所有java代码 做项目初始化
```
task cleanApiLib() {
    delete project.rootProject.project(':module_api').projectDir.path + "/src/main/java"
}
```

2、api文件拷贝指定api_module ,且文件后缀改为".java"
```
task copyApiForCommLib(type: Copy) {

    group 'api'
    //遍历所有项目 将api文件
    for (Project mProject : project.rootProject.getAllprojects()) {
        println(mProject.projectDir.path + "/src/main/java")
        from(mProject.projectDir.path + "/src/main/java") {
            include '**/**.api'
        }
    }

    println(project.rootProject.project(':module_api').projectDir.path + "/src/main/java")
    into file(project.rootProject.project(':module_api').projectDir.path + "/src/main/java")

    //将".api"改名为".java"
    rename { String filename ->
        int index = filename.indexOf(".api")
        String name = filename[0..index] + "java"
        return name
    }

}
```
3、api_module空文件夹清理
```
task clearApiEmptyDir() {
    String filePath = project.rootProject.project(':module_api').projectDir.path + "/src/main/java"
    println("show all filePath:" + filePath)
    clear(new File(filePath))
}

public static void clear(File dir) {
    File[] dirs = dir.listFiles()
    for (File file : dirs) {
        if (file.isDirectory()) {
            clear(file)
        }
    }

    if (dir.isDirectory() && dir.delete())
        println(dir.name + "清理成功")

}
```
4、项目编译时移除原有module中“.api”文件
```
    //删除api文件
    sourceSets {
        main {
            java {
                exclude('**/**.api')
            }
        }
    }
```

#####4、 采用groovy编写weixinApi插件
本插件采用groovy编写，难点在中间的一些语法差异，和细节优化，请大家给我一个star，
主要考虑三点：
* 1、有利于开发者用户快速集成
* 2、减少不必要gradle脚本，干扰到用户，重点在于业务
* 3、增强weixinapi通用性

groovy 编写其中有很多技术难点，想要学习的朋友，可以我写的插件源码component/weixinApi

#####5、喜欢的朋友们记得给我的项目一个star
https://github.com/yinlingchaoliu/AndroidComponent
具体代码位置去".api"插件
component/weixinApi
