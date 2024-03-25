---
title: AndResGuard实战配置
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
```
apply plugin: 'AndResGuard'

buildscript {
    repositories {
        jcenter()
        google()
    }
    dependencies {
        classpath 'com.tencent.mm:AndResGuard-gradle-plugin:1.2.15'
    }
}

andResGuard {
    // mappingFile = file("./resource_mapping.txt")
    mappingFile = null
    use7zip = true
    useSign = true
    // it will keep the origin path of your resources when it's true
    keepRoot = false

    whiteList = [
            // your icon
            "R.drawable.icon",
            "R.mipmap.ic_launcher",
            // for fabric
            "R.string.com.crashlytics.*",
            // for google-services
            "R.string.google_app_id",
            "R.string.gcm_defaultSenderId",
            "R.string.default_web_client_id",
            "R.string.ga_trackingId",
            "R.string.firebase_database_url",
            "R.string.google_api_key",
            "R.string.google_crash_reporting_api_key",
            "R.dimen.rc_*",
            //国内第三方
            // for umeng update
            "R.string.umeng*",
            "R.string.UM*",
            "R.string.tb_*",
            "R.string.rc_*",
            "R.layout.umeng*",
            "R.layout.tb_*",
            "R.layout.rc_*",
            "R.drawable.umeng*",
            "R.drawable.tb_*",
            "R.drawable.rc_*",
            "R.drawable.u1*",
            "R.drawable.u2*",
            "R.anim.umeng*",
            "R.color.umeng*",
            "R.color.tb_*",
            "R.color.rc_*",
            "R.style.*UM*",
            "R.style.umeng*",
            "R.style.rc_*",
            "R.id.umeng*",
            "R.id.rc_*",
            // umeng share for sina
            "R.drawable.sina*",
    ]
    compressFilePattern = [
            "*.png",
            "*.jpg",
            "*.jpeg",
            "*.gif",
            "resources.arsc"
    ]
    sevenzip {
        artifact = 'com.tencent.mm:SevenZip:1.2.15'
        //path = "/usr/local/bin/7za"
    }

}
```

####git地址

命令：
gradle resguardDebug
gradle resguardRelease
gradle resguardUseApk

选文件
https://github.com/shwenzhang/AndResGuard
