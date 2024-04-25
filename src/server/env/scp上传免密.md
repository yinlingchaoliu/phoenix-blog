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

upload.sh
```bash
#!/usr/bin/expect -f

set timeout 30

spawn scp ./ruoyi-admin/target/ruoyi-admin.jar root@101.201.33.54:/root/tomcat/bin

# 同意指纹
#expect "*yes/no*"
# send "yes\r"

expect "*password:"
send "xxxxxx\r"

expect eof
```

### 执行命令
```bash
chmod +x upload.sh
./upload.sh

# sh upload.sh 这个是错误的
```