---
title: node管理 n
date: 2024-03-24 11:47:50
category:
  - 工具
tag:
  - fe
---

### mac node管理 n

安装n
```
npm install -g n
```

查看n 模块的版本
```
n --version
```

展示当前安装的所有版本
```
n list 
n ls
n lsr 10 会列出10开头的远程版本
```

安装指定版本
```
n 14.17.4 
```

删除版本
```
 n rm 14.17.4 
```


切换指定node版本
```
sudo n use 14.17.4

n use xx.xx.x test.js #指定版本运行脚本
```

安装最新版本
```
n latest
```

安装稳定版本
```
n stable
```

