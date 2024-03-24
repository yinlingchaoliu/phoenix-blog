---
title: RESTMock
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---
```
    testImplementation 'com.github.andrzejchm.RESTMock:android:0.3.1'

    allprojects {
	    repositories {
		maven { url "https://jitpack.io" }
	}
    }
```
####use
```
RESTMockServer.whenGET(pathContains("users/andrzejchm"))
            .thenReturnFile(200, "users/andrzejchm.json");
```
url
https://github.com/andrzejchm/RESTMock
