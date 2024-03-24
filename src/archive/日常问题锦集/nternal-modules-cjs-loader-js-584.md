---
title: nternal-modules-cjs-loader-js-584
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---
internal/modules/cjs/loader.js:584
    throw err;

解决方法：

1.删除node_modules 文件夹、package-lock.json文件

2.重新运行：npm install 

3.然后，运行：npm start
