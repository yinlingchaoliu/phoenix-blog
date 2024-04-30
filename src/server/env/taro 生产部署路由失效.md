---
title: taro 生产部署路由失效
date: 2024-04-30 8:47:50
order: 20
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
# 生产部署 dist文件时，路由失效

```

![tab可切换 路由失效](images/taro-router-blank.png)


### 解决方案

* dist部署 要求语法严格，否则无法路由跳转
* basename 为空字符串
* app.config.js 路由要全路径  eg: '/pages/index/index'

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


* 错误 app.config.js
* 应为 "/pages/index/index"
```js
export default {
  pages: [
    "pages/index/index",
    "pages/catalog/catalog",
    "pages/cart/cart",
    "pages/mine/index/index",
  ]
};
```

* 正确的 app.config.js
```js
export default {
  pages: [
    "/pages/index/index",
    "/pages/catalog/catalog",
    "/pages/cart/cart",
    "/pages/mine/index/index",
  ]
};
```


![路由正常](images/taro-router-work.png)

