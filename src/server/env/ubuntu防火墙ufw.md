---
title: ubuntu防火墙ufw
date: 2024-03-24 11:47:50
order: 7
category:
  - server
tag:
  - env
---

### ubuntu 采用防火墙 ufw

```bash
sudo ufw enable  # 开启防火墙

sudo ufw disable  # 关闭防火墙

sudo ufw status  # 查看端口状态
```

### 开放端口

```bash
# 允许外部访问3306端口（tcp/udp）
sudo ufw allow 3306  

# 允许此IP访问本机所有端口
sudo ufw allow from 192.168.1.100  

# 指定IP段访问特定端口
sudo ufw proto tcp from 192.168.1.0/24 to any port 443  

# 删除3306端口的访问权限（关闭端口的访问，外部无法访问该端口）
sudo ufw delete allow 3306  
```
