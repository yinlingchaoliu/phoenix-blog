---
title: 安装redis
date: 2024-03-24 11:47:50
order: 10
category:
  - server
tag:
  - env
---

### 安装redis

```bash
#安装redis

sudo apt-get install redis-server

#确认Redis已经安装并且服务正在运行
sudo systemctl status redis-server


#如果你需要配置Redis，可以编辑配置文件 /etc/redis/redis.conf。


#启动Redis服务：

sudo systemctl start redis-server


#使Redis服务开机自启：

sudo systemctl enable redis-server


redis-cli ping
PONG

```
