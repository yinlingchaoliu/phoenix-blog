---
title: flutter-SmartRefreshBloc页面快速开发模板，支持列表，支持stateful
date: 2024-03-25 22:02:09
category:
  - flutter学习
tag:
  - archive
---
项目地址：https://github.com/yinlingchaoliu/SmartRefreshBloc

#####编写项目的思路
flutter处处体现widget，我们开发过程中，核心放在的是业务层面逻辑，减少不必要的widget编写，减少不必要重复劳动，减少不必要代码层级，作为提高效率的切入点

* 解决问题方式
```
1、用View与Logic解耦方式，增加代码清晰度
2、用模板的方式，给提供统一开发规范方案（普通页面和列表页面）
3、用快捷键方式，一键式快速开发
```

#####1、先实现View与logic解耦
```
import 'package:flutter/material.dart';

/// Created by chentong
///
/// 相当于MVP
///
class BlocProvider<T extends BlocBase> extends StatefulWidget {
  BlocProvider({
    Key key,
    @required this.child, //View
    @required this.bloc, //logic
  }) : super(key: key);

  final T bloc;
  final Widget child;

  @override
  _BlocProviderState<T> createState() => _BlocProviderState<T>();
///核心代码
  static T of<T extends BlocBase>(BuildContext context) {
    final type = _typeOf<BlocProvider<T>>();
    BlocProvider<T> provider = context.ancestorWidgetOfExactType(type);
    return provider.bloc;
  }

  static Type _typeOf<T>() => T;
}

class _BlocProviderState<T> extends State<BlocProvider<BlocBase>> {

  @override
  void initState() {
    super.initState();
    widget.bloc.initState();
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }

  @override
  void dispose() {
    widget.bloc.dispose();
    super.dispose();
  }
}

abstract class BlocBase {
  void initState();

  void dispose();
}
```

这个是核心模板，可以解耦当前flutter页面中Widget与业务逻辑混合在一起的问题。

现在开发一个页面范例，将逻辑层迁移到DefaultBloc当中，而DefaultPage 专注于写widget，减少不必要的耦合。
```
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'base_bloc.dart';

///@author: chentong
///2019-4-9
///视图层
class DefaultPage extends StatefulWidget {
  ///路由跳转
  static void pushDefaultPage(BuildContext context) {
    Navigator.push(
        context,
        new CupertinoPageRoute<void>(
            builder: (ctx) => new BlocProvider<DefaultBloc>(
                  child: new DefaultPage(),
                  bloc: new DefaultBloc(),
                )));
  }

  ///获得当前页面实例
  static StatefulWidget newInstance() {
    return new BlocProvider<DefaultBloc>(
      child: new DefaultPage(),
      bloc: new DefaultBloc(),
    );
  }

  @override
  _DefaultPageState createState() => new _DefaultPageState();
}

///
/// 页面实现
///
class _DefaultPageState extends State<DefaultPage> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final DefaultBloc bloc = BlocProvider.of<DefaultBloc>(context);

    return new Scaffold(
      appBar: new AppBar(
        title: new Text('demo'),
        centerTitle: true,
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
  }
}

///
///逻辑层
///todo:此处逻辑建议迁移出去 分离开解耦
///
class DefaultBloc extends BlocBase {
  @override
  void initState() {}

  @override
  void dispose() {}
}

```


####2、增加高频适配模板

`因为listview列表在APP中是高频使用的存在，基于pull_to_refresh编写列表页面，便于快速开发`

```
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

import 'base_bloc.dart';

///
///list列表
///author:chentong
///
abstract class SmartRefreshBloc extends PullToRefreshBloc {
  RefreshController refreshController;
  ScrollController scrollController;

  ///初始化
  void initState() {
    scrollController = new ScrollController();
    refreshController = new RefreshController();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      refreshController.requestRefresh(true);
    });
  }

  void scrollTop() {
    scrollController.animateTo(0.0,
        duration: new Duration(microseconds: 1000), curve: ElasticInCurve());
  }

  void onRefreshCallBack(bool up) {
    if (up) {
      onRefresh();
    } else {
      onLoadMore();
    }
  }

  ///默认方法
  void onOffsetCallback(bool isUp, double offset) {
    // if you want change some widgets state ,you should rewrite the callback
    if (isUp) {
    } else {}
  }

  ///请求
  void refreshRequest({bool up = true}) {
    refreshController.requestRefresh(up);
  }

  ///完成
  void refreshCompleted() {
    refreshController.sendBack(true, RefreshStatus.completed);
  }

  ///空闲
  void refreshIdle() {
    refreshController.sendBack(false, RefreshStatus.idle);
  }

  ///失败
  void refreshFailed() {
    refreshController.sendBack(false, RefreshStatus.failed);
  }

  ///自定义头部
  Widget headerCreate(BuildContext context, RefreshStatus mode) {
    return new ClassicIndicator(mode: mode);
  }

  ///自定义脚部
  Widget footerCreate(BuildContext context, RefreshStatus mode) {
    return new ClassicIndicator(mode: mode);
  }

  @override
  void dispose() {}
}

///下拉刷新Bloc
abstract class PullToRefreshBloc extends BlocBase {
  ///加载数据
  Future getData({String labelId, int page});

  ///刷新
  Future onRefresh({String labelId});

  ///更多
  Future onLoadMore({String labelId, int page});
}

```

####3、快捷键一键式开发
导入livesettings.jar 
地址：https://github.com/yinlingchaoliu/SmartRefreshBloc/blob/master/livesettings.jar

快捷命令
fstatefulmvp 快速构建stateful页面
flistviewmvp 快速构建listview列表页面

快速实现一键化开发

其中还有flutter其他快捷命令
均是f开头,可以快捷名利可以快速唤起
![](https://upload-images.jianshu.io/upload_images/5526061-763dfb4138b77da5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 

####项目中示例
核心模板代码在此路径
https://github.com/yinlingchaoliu/SmartRefreshBloc/tree/master/example/lib/base
```
///核心模板两个文件
base_bloc.dart
pulltofresh_bloc.dart

///一键化生成代码示例，帮助你快速开发
default_bloc.dart
default_list_bloc.dart
```

项目中重构实战示例在
https://github.com/yinlingchaoliu/SmartRefreshBloc/tree/master/example/lib/ui
```
TestExample.dart
TestExample1.dart
TestExample2.dart
```
