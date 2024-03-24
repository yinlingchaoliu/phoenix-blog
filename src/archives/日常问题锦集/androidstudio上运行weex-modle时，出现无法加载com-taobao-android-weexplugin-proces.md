---
title: androidstudio上运行weex-modle时，出现无法加载com-taobao-android-weexplugin-proces
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---
报错
> Execution failed for task ':app:javaPreCompileDebug'.
Annotation processors must be explicitly declared now.  The following dependencies on the compile classpath are found to contain annotation processor.  Please add them to the annotationProcessor configuration.
    - weexplugin-processor-1.3.jar (com.taobao.android:weexplugin-processor:1.3)
  Alternatively, set android.defaultConfig.javaCompileOptions.annotationProcessorOptions.includeCompileClasspath = true to continue with previous behavior.  Note that this option is deprecated and will be removed in the future.
  See https://developer.android.com/r/tools/annotation-processor-error-message.html for more details.

方案一: 错误阿里已不推荐
```
      javaCompileOptions {
          annotationProcessorOptions {
              includeCompileClasspath = true
          }
      }
```

方案二：正确可用
```
annotationProcessor 'com.taobao.android:weexplugin-processor:1.3'
```
