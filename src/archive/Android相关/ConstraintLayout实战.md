---
title: ConstraintLayout实战
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---

###### 1、自动添加约束(不推荐)
* Autoconnect 针对单个控件
![](https://upload-images.jianshu.io/upload_images/5526061-17c342b453d094e3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* Inference 针对整个布局
![](https://upload-images.jianshu.io/upload_images/5526061-4858476574452cc4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击一下即可，推荐Inference

###### 二、手工写约束
1、相对位置
![](https://upload-images.jianshu.io/upload_images/5526061-4be7f845416d2e59.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <ImageView
        android:id="@+id/logoIv"
        android:layout_width="140dp"
        android:layout_height="86dp"
        android:layout_marginStart="12dp"
        android:layout_marginLeft="12dp"
        android:layout_marginTop="12dp"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:srcCompat="@color/colorAccent" />

    <TextView
        android:id="@+id/infoTv"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_marginLeft="8dp"
        android:layout_marginTop="12dp"
        android:layout_marginRight="12dp"
        android:text="马云:一年交税170多亿马云:一年交税170多亿马云:一年交税170多亿"
        android:textColor="#000000"
        android:textSize="16dp"
        app:layout_constraintLeft_toRightOf="@id/logoIv"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="8dp"
        android:layout_marginLeft="8dp"
        android:text="8分钟前"
        android:textColor="#333"
        android:textSize="12dp"
        app:layout_constraintBottom_toBottomOf="@id/logoIv"
        app:layout_constraintLeft_toRightOf="@id/logoIv"
        app:layout_constraintTop_toBottomOf="@id/infoTv" />

</android.support.constraint.ConstraintLayout>
```

手敲一遍，感受一下。
总结一句口诀
`先写margin ,
后写constraint, 
to是相对控件起始位置`
eg:
```
        //左边距是8dp
        android:layout_marginLeft="8dp"
        //左边距在logoIv右侧开始
        app:layout_constraintLeft_toRightOf="@id/logoIv"

```

2 、match失效
用“0dp”代替
ConstraintLayout中0代表：MATCH_CONSTRAINT

```
 <android.support.constraint.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="12dp"
        android:background="@color/colorPrimary">

        <Button
            android:id="@+id/btn01"
            android:layout_width="100dp"
            android:layout_height="40dp" />

        <Button
            android:id="@+id/btn02"
            android:layout_width="0dp"
            android:layout_height="40dp"
            android:layout_marginStart="12dp"
            android:layout_marginLeft="12dp"
            app:layout_constraintLeft_toRightOf="@id/btn01"
            app:layout_constraintRight_toRightOf="parent"/>

    </android.support.constraint.ConstraintLayout>
```

3、设置宽高比
第一种写法
```
    <android.support.constraint.ConstraintLayout
        android:id="@+id/layout0"
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <TextView
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:background="#765"
            android:gravity="center"
            android:text="Banner"
            app:layout_constraintDimensionRatio="H,16:6" />

    </android.support.constraint.ConstraintLayout>
```
第二种写法
```
    <android.support.constraint.ConstraintLayout
        android:layout_marginTop="12dp"
        app:layout_constraintTop_toBottomOf="@id/layout2"
        android:id="@+id/layout3"
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <TextView
            android:layout_width="0dp"
            android:layout_height="0dp"
            android:background="#765"
            android:gravity="center"
            android:text="Banner"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintDimensionRatio="H,5:1" />

    </android.support.constraint.ConstraintLayout>
```

```
//宽高比设置
app:layout_constraintDimensionRatio="W,16:6"
app:layout_constraintDimensionRatio="H,16:6"
```
4、设置权重
第一种写法

![](https://upload-images.jianshu.io/upload_images/5526061-fa3d92fb4d497bad.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
    <android.support.constraint.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintBottom_toTopOf="@id/layout3">

        <TextView
            android:id="@+id/tab01"
            android:layout_width="0dp"
            android:layout_height="30dp"
            android:background="#f67"
            android:gravity="center"
            android:text="Tab1"
            app:layout_constraintHorizontal_weight="2"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toLeftOf="@id/tab02" />

        <TextView
            android:id="@+id/tab02"
            android:layout_width="0dp"
            android:layout_height="30dp"
            android:background="#A67"
            android:gravity="center"
            android:text="Tab2"
            app:layout_constraintHorizontal_weight="1"
            app:layout_constraintLeft_toRightOf="@id/tab01"
            app:layout_constraintRight_toLeftOf="@id/tab03" />

        <TextView
            android:id="@+id/tab03"
            android:layout_width="0dp"
            android:layout_height="30dp"
            android:background="#767"
            android:gravity="center"
            android:text="Tab3"
            app:layout_constraintHorizontal_weight="1"
            app:layout_constraintLeft_toRightOf="@id/tab02"
            app:layout_constraintRight_toRightOf="parent" />

    </android.support.constraint.ConstraintLayout>
```

第二种写法
![](https://upload-images.jianshu.io/upload_images/5526061-5af144f4c7f29a8b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
    <android.support.constraint.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:layout_constraintBottom_toBottomOf="parent">

        <TextView
            android:id="@+id/tab1"
            android:layout_width="0dp"
            android:layout_height="30dp"
            android:background="#f67"
            android:gravity="center"
            android:text="Tab1"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toLeftOf="@id/tab2" />

        <TextView
            android:id="@+id/tab2"
            android:layout_width="0dp"
            android:layout_height="30dp"
            android:background="#A67"
            android:gravity="center"
            android:text="Tab2"
            app:layout_constraintLeft_toRightOf="@id/tab1"
            app:layout_constraintRight_toLeftOf="@id/tab3" />

        <TextView
            android:id="@+id/tab3"
            android:layout_width="0dp"
            android:layout_height="30dp"
            android:gravity="center"
            android:background="#767"
            android:text="Tab3"
            app:layout_constraintLeft_toRightOf="@id/tab2"
            app:layout_constraintRight_toRightOf="parent" />

    </android.support.constraint.ConstraintLayout>
```

```
app:layout_constraintHorizontal_weight
app:layout_constraintVertical_weight
```

```          
app:layout_constraintHorizontal_chainStyle="spread"
//配合宽度非0dp
```

5、浮动按钮


```
    <TextView
        android:layout_width="60dp"
        android:layout_height="60dp"
        android:background="#612"
        app:layout_constraintHorizontal_bias="0.9"
        app:layout_constraintVertical_bias="0.9"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
```

```
//两侧间隙比例
layout_constraintHorizontal_bias
layout_constraintVertical_bias
```

Guideline

####演示代码
https://github.com/yinlingchaoliu/ConstraintLayoutDemo

![demo效果](https://upload-images.jianshu.io/upload_images/5526061-b11545851fe1a74b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####参考
[http://blog.csdn.net/lmj623565791/article/details/78011599](http://blog.csdn.net/lmj623565791/article/details/78011599) 
本文出自[张鸿洋的博客](http://blog.csdn.net/lmj623565791/)

[Android新特性介绍，ConstraintLayout完全解析](http://blog.csdn.net/guolin_blog/article/details/53122387)
