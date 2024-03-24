---
title: 解决aar包发布到maven问题
date: 2024-03-24 11:47:50
category:
  - git相关
tag:
  - archive
---
####总结
```  
  1、本地编译编译aar
  2、创建Maven 仓库 ,并生成可用aar 类库
  3、若远程依赖失效，引用增加{{transitive=true}}
```

读音：
transitive 英 [ˈtrænsətɪv]  传递
archives   英['ɑ:kaɪvz]  存档

####1、aar打包发布
```
gradle clean build            //本地打包
gradle uploadArchives    //上传aar库
```

maven-push.gradle 文件
***生成aar包含源码、注释***
```
apply plugin: 'maven'

task androidJavadocs(type: Javadoc) {
    source = android.sourceSets.main.java.srcDirs
    classpath += project.files(android.getBootClasspath().join(File.pathSeparator))
}

task androidJavadocsJar(type: Jar, dependsOn: androidJavadocs) {
    classifier = 'javadoc'
    from androidJavadocs.destinationDir
}

task androidSourcesJar(type: Jar) {
    classifier = 'sources'
    from android.sourceSets.main.java.srcDirs
}

artifacts {
    //aar包增加源码
    archives androidSourcesJar
    //aar包增加注释
    archives androidJavadocsJar
}

uploadArchives {
    repositories {
        mavenDeployer {
            repository(url: "http://IP_Address:PORT/nexus/content/repositories/snapshots/") {
                authentication(userName: "账号", password: "密码")
            }
            pom.project {
                groupId = "com.android" //包名
                artifactId = "utils"             //名称
                version = "0.0.1-SNAPSHOT"  //版本

                licenses {
                    license {
                        name 'The Apache Software License, Version 2.0'
                        url 'http://www.apache.org/licenses/LICENSE-2.0.txt'
                    }
                }
            }
        }
    }
}
```

```
本地仓库
url: "file://localhost/" + System.getenv("ANDROID_HOME")
                    + "/extras/android/m2repository/")
```

####2、aar引用

问题：解决远程依赖传递失效问题
```
增加{transitive=true}  //可选项
```

1、本地引用
```
api(name: 'aarlibrary', ext: 'aar'){transitive=true}
```

2、远程依赖
```
allprojects {
    repositories {
        maven { url 'http://IP:PORT/nexus/content/repositories/snapshots' }
        //支持arr包
        flatDir {
            dirs 'libs'
        }
    }
}
```

```
compile('com.android:util:0.0.1'){transitive=true} 
```
