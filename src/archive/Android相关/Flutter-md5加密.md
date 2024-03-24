---
title: Flutter-md5加密
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
```
import 'dart:convert';
import 'package:convert/convert.dart';
import 'package:crypto/crypto.dart';

// md5 加密
String generateMd5(String data) {
  var content = new Utf8Encoder().convert(data);
  var digest = md5.convert(content);
  // 这里其实就是 digest.toString()
  return hex.encode(digest.bytes);
}
```
