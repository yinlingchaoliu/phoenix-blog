---
title: git-配置多个SSH-Key
date: 2024-03-24 11:47:50
category:
  - git相关
tag:
  - archive
---
一台机器配置多个项目托管仓库,需要配置多个key

#### 1、生成ssh-key 以github为例
$ ssh-keygen -t rsa -C "your_email@example.com” -f ~/.ssh/github_rsa

此时，.ssh目录有两个文件：github_rsa	,github_rsa.pub

#### 2、添加私钥
$ ssh-add ~/.ssh/github_rsa

成功提示：
Identity added:~/.ssh/github_rsa (~/.ssh/github_rsa)

错误提示：
Could not open a connection to your authentication agent
解决方案：
1、$ ssh-agent bash
2、然后再运行ssh-add命令。

辅助命令：
`$` ssh-add -l  查看私钥列表
`$` ssh-add -D  清空私钥列表

#### 3、修改配置（~/.ssh/config）
如无创建
touch config

添加以下内容
`#`github
Host github.com
    HostName github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/github_rsa
  
#### 4、为不同的项目设置单独的name和email
git config user.name yourname
git config user.email your-email@address.com
