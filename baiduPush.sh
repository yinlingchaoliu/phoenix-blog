#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

curl -H 'Content-Type:text/plain' --data-binary @urls.txt "http://data.zz.baidu.com/urls?site=https://yinlingchaoliu.github.io&token=OdkhJGLdzCkQXjuc"

# urls.txt  百度链接推送

# https://ziyuan.baidu.com/linksubmit/index