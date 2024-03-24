---
title: Only-fullscreen-opaque-activities-can-request-orientation
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---
####问题原因
安卓8.0版本时为了支持全面屏，增加了一个限制：如果是透明的Activity，则不能固定它的方向，因为它的方向其实是依赖其父Activity的（因为透明）。然而这个bug只有在8.0中有，8.1中已经修复

```
        if (getApplicationInfo().targetSdkVersion > O && mActivityInfo.isFixedOrientation()) {
            final TypedArray ta = obtainStyledAttributes(com.android.internal.R.styleable.Window);
            final boolean isTranslucentOrFloating = ActivityInfo.isTranslucentOrFloating(ta);
            ta.recycle();
 
            if (isTranslucentOrFloating) {
                throw new IllegalStateException(
                        "Only fullscreen opaque activities can request orientation");
            }
        }
```

解决方案 :
1、把方向省掉（建议这种方式）
2、改为不透明
3、反射方式不建议
4、改target版本
