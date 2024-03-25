#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 是否自动部署
auto=""
if [ -z $1 ]; then
  auto=""    
else
  auto=`echo ci $1`
fi

push_addr="git@gitee.com:yinlingchaoliu/yinlingchaoliu.git"
push_branch=master # 推送的分支
user_name=`git log -1 --pretty=format:'%an'`
user_email=`git log -1 --pretty=format:'%ae'`

commit_info=`git describe --all --always --long`
dist_path=src/.vuepress/dist # 打包生成的文件夹路径
mkdir -p $dist_path


# 生成静态文件
pnpm run build

#将readme license拷贝过去
cp README.md $dist_path
cp LICENSE $dist_path

# 将百度网站验证拷贝过去
cp baidu_verify_codeva-xeeBvuMQbl.html $dist_path

# 进入生成的文件夹
cd $dist_path

git init
# git config user.name ${user_name}
# git config user.email ${user_email}
git config --global user.name '引领潮流' 
git config --global user.email 'heat13@qq.com'
git add -A
git commit -m "deploy, $commit_info"
# 使用令牌上传
git remote remove orgin
git remote add origin https://738701067a73a7b52e99b12ee13f2e87@gitee.com/yinlingchaoliu/yinlingchaoliu.git

git push origin master

cd -
# rm -rf $dist_path