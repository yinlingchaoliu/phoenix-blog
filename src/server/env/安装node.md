---
title: 安装node
date: 2024-03-24 11:47:50
order: 11
category:
  - server
tag:
  - env
---

### 安装node

#### 默认安装
```bash
# 默认安装  版本v8.10.0
sudo apt-get install -y nodejs npm

# 卸载
sudo apt-get remove nodejs npm 
```

#### 下载安装

```bash
# 使用curl下载NodeSource PPA安装脚本
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

sudo apt-get install -y nodejs
```

#### 查看版本

```bash
node --version
npm --version
```
