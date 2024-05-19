---
title: github gpg生成秘钥
date: 2024-04-15 11:47:50
category:
  - git相关
tag:
  - git相关
---

github 采用gpg生成秘钥

解决方法：

### 生成key
```bash
gpg --default-new-key-algo rsa4096 --gen-key


pub   rsa4096 2024-05-08 [SC] [有效至：2026-05-08]
      0EF91DB916621AA8A658304ABAB65E6FAFFB5278
uid                      xxx <xxxxx@mail.com>
 
```

### 导出公钥

```bash
# 导出公钥
 gpg --armor --export 0EF91DB916621AA8A658304ABAB65E6FAFFB5278
```

### 仓库镜像管理(gitee->github同步)
