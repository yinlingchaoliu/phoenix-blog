---
title: Android-Build系统信息
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
```
        String board = Build.BOARD;//主板
        String brand = Build.BRAND;//系统定制商
        String[] supportedAbis = Build.SUPPORTED_ABIS;//CPU指令集
        String device = Build.DEVICE;//设备参数
        String display = Build.DISPLAY;//显示屏参数
        String fingerprint = Build.FINGERPRINT;//唯一编号
        String serial = Build.SERIAL;//硬件序列号
        String id = Build.ID;//修订版本列表
        String manufacturer = Build.MANUFACTURER;//硬件制造商
        String model = Build.MODEL;//版本
        String hardware = Build.HARDWARE;//硬件名
        String product = Build.PRODUCT;//手机产品名
        String tags = Build.TAGS;//描述Build的标签
        String type = Build.TYPE;//Builder类型
        String codename = Build.VERSION.CODENAME;//当前开发代码
        String incremental = Build.VERSION.INCREMENTAL;//源码控制版本号
        String release = Build.VERSION.RELEASE;//版本字符串
        int sdkInt = Build.VERSION.SDK_INT;//版本号
        String host = Build.HOST;//Host值
        String user = Build.USER;//User名
        long time = Build.TIME;//编译时间
```

华为p30 pro信息抓取 示例
```
board: VOG
brand: HUAWEI
supportedAbis:[arm64-v8a, armeabi-v7a, armeabi]
device: HWVOG
display: VOG-AL00 9.1.0.186(C00E180R2P1)
fingerprint: HUAWEI/VOG-AL00/HWVOG:9/HUAWEIVOG-AL00/186C00:user/release-keys
serial: unknown
id: HUAWEIVOG-AL00
manufacturer: HUAWEI
model: VOG-AL00
hardware: kirin980
product: VOG-AL00
tags: release-keys
type: user
codename: REL
incremental: 186C00
release: 9
sdkInt: 28
host: sh33773886d1563280923609-155214966-p3j7f
user: test
time: 1563286764000
```
