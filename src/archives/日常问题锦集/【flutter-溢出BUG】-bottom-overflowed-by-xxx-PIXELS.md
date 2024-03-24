---
title: 【flutter-溢出BUG】-bottom-overflowed-by-xxx-PIXELS
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---
解决方案
SingleChildScrollView 包装一下，否则键盘弹出会报空间溢出
