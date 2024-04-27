---
title: scp上传免密
date: 2024-03-24 11:47:50
order: 12
category:
  - server
tag:
  - env
---

### scp上传免密

问题: 一个expect脚本 不支持多个上传交互
解决方案 拆分 expect脚本 for循环

scp.sh
```bash
#!/usr/bin/expect -f

set timeout 30

# 传递第一个参数
set file [lindex $argv 0]

# 上传文件

spawn scp $file root@101.168.1.1:/root/tomcat/bin

# expect "*yes/no*"
# send "yes\r"

expect "*password:"
send "xxxxxx\r"

expect eof
```

### 统一上传

upload.sh 
```bash
#!/bin/sh

./scp.sh ./ruoyi-admin/target/ruoyi-admin.jar

sleep 2

./scp.sh ry.sh

sleep 2

./scp.sh port.sh
```
