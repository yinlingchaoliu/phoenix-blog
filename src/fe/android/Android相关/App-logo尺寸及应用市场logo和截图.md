---
title: App-logo尺寸及应用市场logo和截图
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---

####1、logo尺寸
| DEBSITY | SIZE | RATIO | SCREEN | MARGIN | CONTENT | Padding |
| --- | --- | --- | --- | --- | --- | --- |
| XXXHDPI | 192*192 | 4 | 640DPI | 12-16 | 170*170 | 16 |
| XXHDPI | 144*144 | 3 | 480DPI | 8-12 | 128*128 | 8 |
| XHDPI | 96*96 | 2 | 320DPI | 6-8 | 88*88 | 4 |
| HDPI | 72*72 | 1.5 | 240DPI | 4-6 | 68*68 | 2 |
| MDPI | 48*48 | 1 | 160DPI | 3-4 | 46*46 | 1 |
| LDPI | 36*36 | 0.75 | 120DPI | 2-3 | 34*34 | 1 |
| N/A | 512*512 | Google play | NA | NA | As Required ||

建议在设计过程中，在四周空出几个像素点使得设计的图标与其他图标在视觉上一致
eg:96 x 96 px 图标可以画图区域大小可以设为 88 x 88 px， 四周留出4个像素用于填充（无底色）。

安卓建议：
提供MDPI~XXXHDPI, 图标有正常和圆角两种

####2、应用市场截图尺寸

应用市场logo
| 应用市场 | 图片尺寸 | 体积 | 格式 | 特别建议 |
| --- | --- | --- | --- | --- |
| 应用宝 | 16*16 | 20k以内 | Png |  |
| 应用宝 | 512*512 | 200K以内 | Png | 直角图标 |
| 华为 | 216*216 |  | Png | 正方形图片 圆角32px |
| VIVO | 512*512 | 小于50K | PNG | 正方形图片，直角图标 |
| 阿里分发平台 | 512*512 |  | Png | 背景透明带圆角 |
| 小米 | 216*216 |  | Png | 正方形图片 |

应用市场截图

| 市场 | 截图要求 | 特殊要求 |
| --- | --- | --- |
| 应用宝 | 480*800 4张 1M PNG |  |
| 阿里分发平台 | 480*800 4张 1M PNG | 不可上传ios截图 |
| 百度 | 480*800 4张 1M PNG | 通知栏不含有与app自身无关的应用图标 |
| 华为 | 450*800 4张 1M PNG |  |
| 小米 | 720*1280 4张 1M PNG | 若截图含有手机外观，必须使用小米手机外观素材 |
| OPPO | 1080*1920 4张 1M PNG | 去除顶部通知栏，不得使用其他品牌手机作为边框或宣传图 |
| VIVO | 480*800 4张 1M PNG |  |


######应用截图要求
```
体积 小于1M 4 张  PNG
尺寸
480*800
450*800
720*1280
1080*1920 
特别要求：
1、无ios截图
2、无通知栏
3、无手机外观
```
