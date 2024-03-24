---
title: Landroid-support-design-widget-CoordinatorLayout
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---
将support库 强行设置
```
configurations.all {
    resolutionStrategy {
        force 'com.android.support:support-v4:28.0.0'
        force 'com.android.support:design:28.0.0'
    }
}
```

参考
https://stackoverflow.com/questions/49043551/multiple-dex-files-define-landroid-support-design-widget-coordinatorlayout1
