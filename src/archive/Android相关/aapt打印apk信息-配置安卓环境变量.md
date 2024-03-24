---
title: aapt打印apk信息-配置安卓环境变量
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
打印apk信息
```bash
aapt dump badging app-debug.apk
```

配置安卓环境变量
```bash
export ANDROID_HOME=/Users/chentong/Android/sdk
export ANDROID_NDK=$ANDROID_HOME/ndk-bundle
export ANDROID_TOOLS=$ANDROID_HOME/tools
export ANDROID_PLATFORM_TOOLS=$ANDROID_HOME/platform-tools
export ANDROID_BUILD_TOOLS=$ANDROID_HOME/build-tools/26.0.2
export PATH=$PATH:$ANDROID_HOME:$ANDROID_TOOLS:$ANDROID_PLATFORM_TOOLS:$ANDROID_NDK:$ANDROID_BUILD_TOOLS
```
环境变量生效
```bash
source .bash_profile
```
