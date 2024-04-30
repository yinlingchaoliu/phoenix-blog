---
title: Uncaught SyntaxError Unexpected token  '/<' (at 
date: 2024-04-30 8:47:50
order: 19
category:
  - server
tag:
  - env
---

### 背景

taro h5
```bash

yarn dev:h5  
# 测试h5 页面没有问题 本地调试没有问题


yarn build:h5 
serve -s dist
# 生产部署 dist文件时，报错 Uncaught SyntaxError: Unexpected token  '/<' (at 

```

### 解决方案

问题: 在打包后引入的资源路径出错的问题

* publicPath 根据情况设置 
* 核心关注点 publicPath  basename 属性

dev.js
```js
module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {},
  h5: {
    publicPath: "/h5",
    router: {
      basename: "/h5",
      mode: "browser",
    },
    devServer: {
      port: 10086,
      overlay: false,
      host: "localhost",
    },
  },
};
```

prod.js
```js
module.exports = {
  env: {
    NODE_ENV: '"production"',
  },
  defineConstants: {},
  mini: {},
  h5: {
    publicPath: "/",
    router: {
      basename: "",
      mode: "browser",
    },
    devServer: {
      port: 10086,
      overlay: false,
      host: "localhost",
    },
  },
};

```
