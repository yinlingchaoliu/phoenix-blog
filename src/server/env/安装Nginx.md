---
title: 安装Nginx
date: 2024-03-24 11:47:50
order: 3
category:
  - server
tag:
  - env
---

ubuntu Nginx 安装

在Ubuntu系统上安装Nginx可以通过以下步骤进行：

### 更新包索引：

```bash
sudo apt update
```

### 安装Nginx：

```bash
sudo apt install nginx
```


### 启动Nginx服务：

```bash
sudo systemctl start nginx
```


### 设置Nginx开机自启：

```bash
sudo systemctl enable nginx
```

### 验证安装成功，打开浏览器并访问：

```bash
http://your_server_ip
```

如果安装成功，你应该看到Nginx的默认欢迎页面。
