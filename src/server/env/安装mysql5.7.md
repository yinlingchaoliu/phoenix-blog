---
title: 安装mysql5.7
date: 2024-03-24 11:47:50
order: 1
category:
  - server
tag:
  - env
---

### 更新包管理器的索引
```bash
sudo apt update 
```

### 安装MySQL

```bash
sudo apt install mysql-server-5.7
```

### 检查MySQL服务的状态，确保它正在运行：

```bash
sudo systemctl status mysql.service 

● mysql.service - MySQL Community Server
   Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: enabled)
   Active: active (running) since Sun 2024-04-21 10:41:45 CST; 4s ago
  Process: 9630 ExecStart=/usr/sbin/mysqld --daemonize --pid-file=/run/mysqld/mysqld.pid (code=exited, status=0/SUCCESS)
  Process: 9621 ExecStartPre=/usr/share/mysql/mysql-systemd-start pre (code=exited, status=0/SUCCESS)
 Main PID: 9632 (mysqld)
    Tasks: 27 (limit: 4503)
   CGroup: /system.slice/mysql.service
           └─9632 /usr/sbin/mysqld --daemonize --pid-file=/run/mysqld/mysqld.pid

Apr 21 10:41:45 iZ2ze6r3rvh2dc9nds2291Z systemd[1]: Starting MySQL Community Server...
Apr 21 10:41:45 iZ2ze6r3rvh2dc9nds2291Z systemd[1]: Started MySQL Community Server.

```

### 设置密码  无密码直接回车

```bash
sudo mysql -u root -p

# root设置新密码
update mysql.user set authentication_string=PASSWORD('111111') where user = 'root';

# 刷新
FLUSH PRIVILEGES;

# 退出
exit
```

### 重启服务
```bash
sudo service mysql restart
```
