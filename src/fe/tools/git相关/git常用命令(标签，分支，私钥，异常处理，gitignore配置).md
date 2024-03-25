---
title: git常用命令(标签，分支，私钥，异常处理，gitignore配置)
date: 2024-03-24 11:47:50
category:
  - git相关
tag:
  - archive
---
#### 设置全局信息
git config --global user.name "chentong"
git config --global user.email "chentong01@gmail.com"

#### 生成私钥
ssh-keygen -t rsa -b 4096 -C "chentong01@gmail.com"

查看公钥
cat ~/.ssh/id_rsa.pub
拷贝公钥至剪切板（mac）
clip < ~/.ssh/id_rsa.pub

#### 正常创建git项目流程
mkdir appdir      //创建文件夹
cd appdir
git init                  //git项目初始化
touch README.md     //新建readme文档
git add README.md   //git add 文件
git commit -m "first commit"    //本地提交 
git remote add origin git@github.com:yinlingchaoliu/githubAppWeex.git
// 仓库增加远程链接
git push -u origin master  //推送至远程仓库

#### 将非git项目本地代码 提交到新的远程仓库
cd appdir
git init  //git项目初始化
git add *   
git commit  -m "first comit"
git remote rm origin       //删除旧的远程链接  
git remote add origin   git@github.com:yinlingchaoliu/githubAppWeex.git 
//增加新的远程链接
 git push --set-upstream origin master  //推送至远程

#### 克隆下载项目
git clone git@github.com:yinlingchaoliu/githubAppWeex.git

#### 分支命令
查看分支
git branch
查看分支（远程+本地）
git branch --all
创建特性分支（feature_name 分支名）
git checkout -b  feature_name
切换分支
git checkout  feature_name
合并分支
git merge  feature_name
删除分支
git branch -d  feature_name
推送到指定分支
git push -u origin feature_name

#### 查看项目状态
git  status （任何情况随时要git status）

#### tag标签
显示所有tag
git tag 
打标签
git tag v1.0.0
git tag v1.0.0 -m "1.0.0版本" 增加附注
git tag  v1.0.0 9fbc3d0  补打标签
查看标签信息
git show v1.0.0
推送标签
git push origin v1.0.0 上传标签
git push origin –tags  所有标签推送上去
删除标签
git push origin --delete v1.0.0
获取指定tag代码
git checkout tag
创建分支基于指定tag 
git checkout -b branch tag   

#### 远程项目管理
查看远程项目
 git remote -v
删除项目远程地址
git remote rm origin
添加远程项目
git remote add origin   git@github.com:yinlingchaoliu/githubAppWeex.git

#### 异常处理
git reset --hard HEAD 表示所有都撤销都以前状态
git reset --soft HEAD  撤销commit
git branch --set-upstream dev origin/dev  与远程分支建立链接
git branch --set-upstream-to=origin/dev
git push --set-upstream origin master  //推送至远程

#### .gitignore 配置文件
```
*.[oa]   忽略.a .o 结尾
 *~  忽略~ 结尾
# '#' 开头是注释或者当前行配置失效

# 忽略所有 .a 结尾的文件
*.a
#!在模式前加上惊叹号（!）取反
# lib.a 除外
!lib.a
#匹配模式最后跟反斜杠（/）说明要忽略的是目录。
# 仅仅忽略项目根目录下的 TODO 文件，不包括subdir/TODO
/TODO
# 忽略 build/ 目录下的所有文件
build/
# 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
doc/*.txt
```

git配置
```
$ cd  ~
$ vi .gitconfig
//配置文件内容
[user]
        name = 陈桐
        email = chentong01@hexindai.com
        password = hexin@123
[branch]
        autosetuprebase = always
[core]
        autocrlf = input
        excludesfile = /Users/chentong/.gitignore_global
```

全局.gitignore配置，每个项目都生效
```
cd ~
vi .gitignore_global
*~
.DS_Store
.externalNativeBuild
local.properties
.gradle/
.idea/
/captures
build
```
