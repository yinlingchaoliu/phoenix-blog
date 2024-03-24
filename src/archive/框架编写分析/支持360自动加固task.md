---
title: 支持360自动加固task
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---
支持360自动加固task

执行命令
![执行命令 gradle jiaguDebug](https://upload-images.jianshu.io/upload_images/5526061-7eb1534d72a570dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

引用
```
apply from: "jiagu.gradle"
```

配置
```
def executeCmd(cmd){
    def jiaGuPluginPath = getJiaGuProperty()
    println "执行命令行:" + cmd
    println "jiagu.dir=" + getJiaGuProperty()
    def p = cmd.execute(null, new File(jiaGuPluginPath))
    println p.text
    p.waitFor()  // 用以等待外部进程调用结束
    println p.exitValue()
}

def getJiaGuProperty(){
    File file = rootProject.file('local.properties')
    if(file.exists()){
        //加载资源
        InputStream inputStream = rootProject.file('local.properties').newDataInputStream()
        Properties properties = new Properties()
        properties.load(inputStream)

        if (properties.containsKey("jiagu.dir")){
            return properties.getProperty("jiagu.dir")
        }else {
            println "请在local.properties 添加jiagu.dir 例子如下"
            println "jiagu.dir=/Users/chentong/Android/360jiagubao_mac/jiagu"
            return ""
        }
    }
}

task jiaguDebug(dependsOn: 'assembleDebug') {
    group "jiaguapk"
    doLast {
        jiagu("debug")
    }
}

task jiaguRelease(dependsOn: 'assembleRelease') {
    group "jiaguapk"
    doLast {
        jiagu("release")
    }
}

def jiagu(buildType){

    println "360加固--------begin---------"

    //获得apk路径
    def appFilePath = getAppFilePath(buildType)

    if (!new File(appFilePath).exists()) {
        println "apk not exist"
        return
    }

    def cmdBase = 'java -jar jiagu.jar'

    //获得加固宝输出路径
    def outPath = getJiaGuPath()

    File outFile = new File(outPath)
    if (!outFile.exists()){
        outFile.mkdirs()
    }

    def cmdJiaGu = cmdBase + ' -jiagu ' + appFilePath + ' ' + outPath + ' -autosign' + ' -automulpkg'

    executeCmd(cmdJiaGu)
    println "360加固--------end---------"
}

def getAppFilePath(buildType){
    // 生成的apk的路径
    def appFilePath = getRootDir().getAbsolutePath() + File.separator + "app" +
            File.separator + "build" + File.separator + "outputs" + File.separator + "apk" +File.separator + buildType + File.separator +
            "app-" + buildType + ".apk"
    println "appFilePath=" + appFilePath
    return appFilePath
}

def getJiaGuPath(){
    def outPath = getRootDir().getAbsolutePath() + File.separator + "app" + File.separator + "360jiagu"
    println "jiaguPath=" + outPath
    return outPath
}

//清理加固文件
tasks.whenTaskAdded { theTask ->
    if (theTask.name == "assembleRelease" | theTask.name == "assembleDebug") {
        theTask.dependsOn "cleanJiaguDir"
    }
}

task cleanJiaguDir {
    def jiaguPath = getJiaGuPath()
    new File(jiaguPath).deleteDir()
}
```

感谢[月亮的后羿](/u/2f479b1467f1)提出的问题
我的task命令的打印日志：可以看一下
https://www.jianshu.com/p/fb538da65d28


后续优化方向
https://www.githang.com/2019/01/23/jenkins-enhanced/
