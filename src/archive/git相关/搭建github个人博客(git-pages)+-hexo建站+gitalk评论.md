---
title: 搭建github个人博客(git-pages)+-hexo建站+gitalk评论
date: 2024-03-24 11:47:50
category:
  - git相关
tag:
  - archive
---
如题，让博客666起来

#### 1、创建github仓库
*  1、创建仓库 github.io
![](https://upload-images.jianshu.io/upload_images/5526061-06febc87b87889b9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
https://yinlingchaoliu.github.io

* 2、新建仓库 hexo
git@github.com:yinlingchaoliu/hexo.git

建站Hexo + 中文文档
https://hexo.io/zh-cn/docs/

#### 2、Hexo 建站
```
npm  install  -g hexo-cli  //下载hexo插件
hexo init hexo  //创建博客目录是hexo
cd hexo 
git clone https://github.com/theme-next/hexo-theme-next themes/next  //下载next主题
//采用next指定模板 v5.1.3
git checkout  v5.1.3
```

修改根目录下_config.yml文件
repo 是 github.io 仓库
```
theme: next
//配置Deployment
deploy:
  type: git
  repo: git@github.com:yinlingchaoliu/yinlingchaoliu.github.io.git
  branch: master
```

新建页面
```
hexo new "page title"  //新建页面
```
在指定md文件下一通狂写
![](https://upload-images.jianshu.io/upload_images/5526061-de1bd0c5520c61b1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

本地部署
```
hexo clean
hexo g
hexo server
```
地址：http://localhost:4000

远程部署 与gitpage关联
```
//安装插件
sudo npm install --save hexo-deployer-git
//远程部署
hexo clean
hexo d  g  //部署并发布
```

`代码自动部署github.io仓库`

此时可以查看远程地址
https://yinlingchaoliu.github.io/

#### 3、上传hexo源码至仓库
```
cd hexo
git init 
git add * 
//删除 theme/next git仓库文件
rm -rf theme/next/.git
git add  * 
git  commit  -m "first commit"
//添加远程依赖
git remote add origin  git@github.com:yinlingchaoliu/hexo.git
git push --set-upstream origin master //推送至远程
```

说明：我们只是操作hexo.git 仓库，部署时候，生成页面会自动同步到github.io 仓库
hexo.git 仓库内容记得也要上传

#### 添加gitalk评论
https://github.com/gitalk/gitalk

1、`申请Github Application`，如果没有 [点击这里申请](https://github.com/settings/applications/new)
Authorization callback URL 填写你主页地址
eg: https://yinlingchaoliu.github.io



#### 备注 Mac 按照端口杀进程
lsof -i :port
kill -9 pid
```
$ lsof  -i :4000
COMMAND   PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    79748 chentong   40u  IPv4 0xc0817c4a2f69df89      0t0  TCP *:terabase (LISTEN)
$ kill -9  79748
```
