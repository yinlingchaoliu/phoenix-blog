---
title: CMTC笔记总结-大前端
date: 2024-03-24 11:47:50
category:
  - 架构相关
tag:
  - archive
---
####技术架构
业务组件配置化：1小时快速构建拥有基础能力的应用
基础模块化：groovy脚本，丰富基础库，统一接入，加速开发，定制化支持，构建高质量、健壮的APP
业务配置化：依赖倒置原则  组件+模板
通信路由：统一协议，调度中心，资源复用
serviceLoader

serverless
前端研发模式升级
1、更多参与到业务交付中 2、跨技术栈提升研发效能
同时，不希望引入太多额外成本
前后端分离、康威定律、微服务、DevOps、应用治理、容器化、故障演练
BFF
业务开发的本质是交付服务和功能

2、why serverless
通过引入serverless,让轻量化的业务服务端研发成为可能，降低前端参与业务交付的门槛，同时也让从云端一体的视角重新审视研发效率，性能优化成为可能

业务开发变轻、变薄、聚焦业务逻辑
Faas + BaaS
Focus on the goal
只关心自己业务交付

![快速建场](https://upload-images.jianshu.io/upload_images/5526061-3cce06e99e24d7d9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![架构](https://upload-images.jianshu.io/upload_images/5526061-5193dae1a669e644.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

大前端架构演进
组件化、动态化、中台化、工厂化

架构：代码质量、快速迭代、多端公用、代码复用
![](https://upload-images.jianshu.io/upload_images/5526061-6fea3a7447593165.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
快速上线、代码复用、可插拔

![](https://upload-images.jianshu.io/upload_images/5526061-ae43c811196811a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![H5优化](https://upload-images.jianshu.io/upload_images/5526061-54a2cbff22dc7b71.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![框架图](https://upload-images.jianshu.io/upload_images/5526061-bd9143db5a36564d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/5526061-f53846603fc98e14.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

reactnative   weex

中台化核心做两件事：上云+公共服务

![](https://upload-images.jianshu.io/upload_images/5526061-c1268f235f7f3c8e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/5526061-6c2fa5f64ce72f47.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/5526061-78500707cb75186e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/5526061-b6a2e2c4dab2e508.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

opengl

h5视频化

![image.png](https://upload-images.jianshu.io/upload_images/5526061-ae7c2999f24d6e31.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

工厂化：
底层服务：包含所有音视频服务
应用工具：服务自动化、脚手架、打包工具
服务多端：一套代码服务多端
应用框架：组件化、动态化、中台化
UI:UI组件、模板
前后端联通：前后端bridge联通

![](https://upload-images.jianshu.io/upload_images/5526061-e920fd4303272add.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

跨平台多端赋能，新场景、新上课方式


####超大型工程矩阵
项目组件化
规范通用库维护流程
自动化构建流程
基础功能自动化


通用组件管理
二进制化：所有组件提供二进制化功能，可以提高编译速度，避免源文件暴露问题
组件升级：统一三位版版本号管理规则，避免版本升级混乱
组件订阅：通过关注组件，即时了解组件升级动态
静态分析：自定义规则分析组件质量
issue管理：用户通过平台入口，向关心组件提issue
历史维护：维护组件的历史升级版本，方便回溯与追查问题

![image.png](https://upload-images.jianshu.io/upload_images/5526061-c23ae200115a33e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

native工具支撑
开发信息数据收集
文档管理

自动化构建
![](https://upload-images.jianshu.io/upload_images/5526061-431f985ebe58cdc4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

效率以及稳定性提升
