---
title: monkey压力测试
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---
####脚本命令

```
#!/usr/bin/env bash

# 生成随机文件
LOGFILE="monkey"$[RANDOM]".txt"
#echo $RANDOM  生成随机数

echo $LOGFILE

adb shell monkey -p PACKNAME  --throttle 300   -s 1000 -v -v -v 100  \
        --ignore-crashes  --ignore-timeouts  --ignore-security-exceptions \
        --monitor-native-crashes > $LOGFILE

#注释  -p apk包名  --throttle 时间间隔  -v -v -v 最详细日志 -s 随机事件  100 次数\
#       忽略崩溃   忽略ANR  忽略安全许可错误 \
#     报告崩溃本地代码
```

####参考文章
https://github.com/zilianliuxue/AndroidStudy/blob/master/Android%E6%80%A7%E8%83%BD/Android%20Monkey%20%E5%8E%8B%E5%8A%9B%E6%B5%8B%E8%AF%95.md
