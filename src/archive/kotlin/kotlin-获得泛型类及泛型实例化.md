---
title: kotlin-获得泛型类及泛型实例化
date: 2024-03-24 11:47:50
category:
  - kotlin
tag:
  - archive
---
kotlin 这个体验也太好了

```
// 获得T.class
inline fun <reified T> classOf()  = T::class.java

//获得 T object
inline fun <reified T> instanceOf()  = T::class.java.newInstance()

fun main() {
    var clazz = classOf<String>()
    var str = instanceOf<String>()
}

```
