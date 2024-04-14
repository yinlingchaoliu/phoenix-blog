---
title: git命令中文乱码
date: 2024-04-15 11:47:50
category:
  - git相关
tag:
  - git相关
---

Git命令中文乱码通常是因为Git配置的默认编码与系统或终端的编码不一致导致的。

解决方法：

### mac
```bash
git config --global core.quotepath false
git config --global gui.encoding utf-8
git config --global i18n.commit.encoding utf-8
git config --global i18n.logoutputencoding utf-8
```

### windows
```bash
git config --global core.quotepath false
set LESSCHARSET=utf-8
```