---
title: finalshell安装-及-mac远程桌面安装
date: 2024-03-24 11:47:50
category:
  - 常用工具
tag:
  - archive
---
####finalshell官网
http://www.hostbuf.com

Mac版安装路径
/Applications/finalshelldata

Linux版安装路径
/usr/lib/finalshelldata

####安装命令
Mac一键安装脚本
curl -o finalshell_install.sh www.hostbuf.com/downloads/finalshell_install.sh;chmod +x finalshell_install.sh;sudo ./finalshell_install.sh

Linux一键安装脚本1(通用)
rm -f finalshell_install.sh ;wget finalshell_install.sh www.hostbuf.com/downloads/finalshell_install.sh;chmod +x finalshell_install.sh;sudo ./finalshell_install.sh

Linux一键安装脚本2(适合系统没有sudo或未加入sudoer,比如debian)
rm -f finalshell_install.sh ;wget finalshell_install.sh www.hostbuf.com/downloads/finalshell_install.sh;chmod +x finalshell_install.sh;su -l --preserve-environment -c ./finalshell_install.sh


mac远程桌面
Microsoft Remote Desktop for Mac
下载地址：
https://www.newasp.net/soft/320727.html
实测可用
