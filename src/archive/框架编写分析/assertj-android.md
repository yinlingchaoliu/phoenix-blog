---
title: assertj-android
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---

```
//常用top 5
    testImplementation 'com.squareup.assertj:assertj-android:1.2.0'
    testImplementation 'com.squareup.assertj:assertj-android-support-v4:1.2.0'
    testImplementation 'com.squareup.assertj:assertj-android-appcompat-v7:1.2.0'
    testImplementation 'com.squareup.assertj:assertj-android-design:1.2.0'
    testImplementation 'com.squareup.assertj:assertj-android-recyclerview-v7:1.2.0'
//不常用的
    testImplementation 'com.squareup.assertj:assertj-android-play-services:1.2.0'
    testImplementation 'com.squareup.assertj:assertj-android-mediarouter-v7:1.2.0'
    testImplementation 'com.squareup.assertj:assertj-android-gridlayout-v7:1.2.0'
    testImplementation 'com.squareup.assertj:assertj-android-cardview-v7:1.2.0'
    testImplementation 'com.squareup.assertj:assertj-android-palette-v7:1.2.0'
```

####Example
* AssertJ Android:
```
assertThat(view).isGone();
```
* Regular JUnit:
```
assertEquals(View.GONE, view.getVisibility());
```
* Regular AssertJ:
```
assertThat(view.getVisibility()).isEqualTo(View.GONE);
```
#### ALL
* AssertJ Android:
```
assertThat(layout).isVisible()
    .isVertical()
    .hasChildCount(4)
    .hasShowDividers(SHOW_DIVIDERS_MIDDLE);
```

url
https://github.com/square/assertj-android
