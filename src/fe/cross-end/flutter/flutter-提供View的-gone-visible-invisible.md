---
title: flutter-提供View的-gone-visible-invisible
date: 2024-03-25 22:02:09
category:
  - flutter学习
tag:
  - archive
---
安卓一般View有三种显示方式gone visible invisible 
fultter也要提供相应的支持，这个是验证可用的

```
import 'package:flutter/widgets.dart';
import 'package:meta/meta.dart';

enum VisibilityFlag {
  visible,
  invisible,
  offscreen,
  gone,
}

class Visibility extends StatelessWidget {
  final VisibilityFlag visibility;
  final Widget child;
  final Widget removeChild;

  Visibility({
    @required this.child,
    @required this.visibility,
  }) : this.removeChild = Container();

  @override
  Widget build(BuildContext context) {
    if (visibility == VisibilityFlag.visible) {
      return child;
    } else if (visibility == VisibilityFlag.invisible) {
      return new IgnorePointer(
          ignoring: true, child: new Opacity(opacity: 0.0, child: child));
    } else if (visibility == VisibilityFlag.offscreen) {
      return new Offstage(offstage: true, child: child);
    } else {
      return removeChild;
    }
  }
}


```
