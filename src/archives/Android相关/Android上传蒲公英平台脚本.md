---
title: Android上传蒲公英平台脚本
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
####1、前言

[使用jenkins实现持续集成](https://www.pgyer.com/doc/view/jenkins),需要编写上传蒲公英平台的脚本
本文目的提供一个比较通用且优雅的脚本，遇到这个问题的同学点个赞👍

####脚本
```
#!/usr/bin/env bash
##author chentong
##date 2019/2/12

##json解析函数
function jsonParse() { # $1 $2  json lable

     JSON_CONTENT=$1
     KEY='"'$2'":'

     echo ${JSON_CONTENT} | awk -F  ${KEY}  '{print $2}' | awk -F '"' '{print $2}'
}

##删除斜杠'\'
function trimSlash() {
    TEXT=$1
    echo ${TEXT//'\'/''}
}

##解析返回报文
function showApkInfo() {
    CONTENT=$1
    echo "App的名称:"    $(jsonParse "${CONTENT}" "appName")
    echo "AppId   :"    $(jsonParse "${CONTENT}" "appIdentifier")
    echo "App版本名:"    $(jsonParse "${CONTENT}" "appVersion")
    echo "App版本号:"    $(jsonParse "${CONTENT}" "appVersionNo")
    echo "AppBuild:"    $(jsonParse "${CONTENT}" "appBuildVersion")
    echo "App包体积:"    $(jsonParse "${CONTENT}" "appFileSize")
    echo "App短链接:"    "https://www.pgyer.com/"$(jsonParse "${CONTENT}" "appShortcutUrl")
    echo "App下载页地址:" "https://www.pgyer.com/"$(jsonParse "${CONTENT}" "appKey")
    echo "App二维码地址:" $(trimSlash $(jsonParse "${CONTENT}" "appQRCodeURL"))
    echo "App上传时间:"   $(jsonParse "${CONTENT}" "appCreated")
}

####上传蒲公英

API_KEY="acfdf25fdc001ebb2494b1ab8a566193"
USER_KEY="3466d4f5d349cc81e8b3f761d86e9856"

##获得apk全路径
fileName=`basename ./app/build/outputs/apk/debug/*.apk`
APK_PATH="./app/build/outputs/apk/debug/$fileName"

##上传apk 获得返回报文

echo 'Uploading...'
echo '✈ -------------------------------------------- ✈'

RESPONSE=$(curl -F "file=@${APK_PATH}" \
        -F "uKey=${USER_KEY}" \
        -F "_api_key=${API_KEY}" \
        https://qiniu-storage.pgyer.com/apiv1/app/upload)

##显示apk信息
showApkInfo "${RESPONSE}"
```
