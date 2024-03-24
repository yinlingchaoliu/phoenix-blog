---
title: Apk上传fir-im平台
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
#####亲测可用
脚本如下
```
#!/bin/bash
#author chentong 20190312

##json解析函数
function jsonParse() { # $1 $2  json lable

     JSON_CONTENT=$1
     KEY='"'$2'":'

     echo ${JSON_CONTENT} | awk -F  ${KEY}  '{print $2}' | awk -F '"' '{print $2}'
}

##replace函数
function TrimAnd(){
    TEXT=$1
    echo ${TEXT//'\u0026'/'&'}
}

# Get API Token from http://fir.im/apps
API_TOKEN="77ec123979f83f7caef71c4ca70abeeb"
fileName=`basename ./app/build/outputs/apk/debug/*.apk`
apkPath="./app/build/outputs/apk/debug/$fileName"

# ios or android
TYPE="android"
# App 的 bundleId
BUNDLE_ID="你的AppId"

# Get upload_url
credential=$(curl -X "POST" "http://api.fir.im/apps" \
-H "Content-Type: application/json" \
-d "{\"type\":\"${TYPE}\", \"bundle_id\":\"${BUNDLE_ID}\", \"api_token\":\"${API_TOKEN}\"}" \
2>/dev/null)

SHORT_NAME=$(jsonParse "${credential}" "short")
fir_id=$(jsonParse "${credential}" "id")
binary_response=$(echo ${credential} | grep -o "binary[^}]*")
KEY=$(jsonParse "${binary_response}" "key")
TOKEN=$(jsonParse "${binary_response}" "token")
UPLOAD_URL=$(jsonParse "${binary_response}" "upload_url")

# Upload package
echo 'Uploading...'
echo '✈ -------------------------------------------- ✈'
response=$(curl -F "key=${KEY}" \
-F "token=${TOKEN}" \
-F "file=@${apkPath}" \
-F "x:build=1" \
${UPLOAD_URL}
)

release_id=$(jsonParse "${response}" "release_id")
download_url=$(jsonParse "${response}" "download_url")

echo APP  名字:      你的APP
echo APP  包名:       "${BUNDLE_ID}"
echo APP  类型:       "${TYPE}"
echo 应用 ID:         "${fir_id}"
echo 上传apk路径:      "${apkPath}"
echo 通用二维码地址:    https://fir.im/"${SHORT_NAME}"
echo APP二维码地址:    https://fir.im/"${SHORT_NAME}"?release_id="${release_id}"
echo 下载地址如下:
echo $(TrimAnd "${download_url}")
```
