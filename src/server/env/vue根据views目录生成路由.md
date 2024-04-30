---
title: vue根据views目录生成路由
date: 2024-03-24 11:47:50
order: 18
category:
  - server
tag:
  - env
---

### path匹配方法

```js
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect"),
      },
    ],
  }
```

### vue根据views目录生成路由
读取目录方法

```js
function getRoutesByViews() {
  const compContext = require.context("../views", true, /index\.vue$/);
  const routes = compContext
    .keys()
    .map((key) => {
      var name = key.replace("/index.vue", "").replace(".", "");
      var compPath = key.replace("/index.vue", "").replace("./", "@views/");
      //: compContext(key).default
      // component: () => import(compPath),
      console.log(name);
      console.log(compPath);
      return {
        name,
        path: name,
        component: () => import(compPath),
        hidden: true,
        redirect: "noredirect",
      };
    })
    .filter((item) => {
      return item.name !== "";
    });
  return routes;
}
const viewsRoutes = getRoutesByViews();

console.log("routesDir==========");
console.log(viewsRoutes);
```

### 人工注册

* 生产环境 需要人工注册路由 否则不能跳转 module not found

```js 

const routes=[
   {
    path: "/pms",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "product",
        component: () => import("@/views/pms/product/index"),
        name: "product",
        meta: { title: "商品列表", icon: "user" },
      },
      {
        path: "brand",
        component: () => import("@/views/pms/brand/index"),
        name: "brand",
        meta: { title: "品牌列表", icon: "user" },
      },
      {
        path: "productCategory",
        component: () => import("@/views/pms/productCategory/index"),
        name: "productCategory",
        meta: { title: "商品分类", icon: "user" },
      },
    ],
  },
  {
    path: "/order",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "order",
        component: () => import("@/views/oms/order/index"),
        name: "order",
        meta: { title: "订单列表", icon: "user" },
      },
      {
        path: "aftersale",
        component: () => import("@/views/oms/aftersale/index"),
        name: "aftersale",
        meta: { title: "售后详情", icon: "user" },
      },
    ],
  },
  {
    path: "/member",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "member",
        component: () => import("@/views/ums/member/index"),
        name: "member",
        meta: { title: "会员列表", icon: "user" },
      },
      {
        path: "memberAddress",
        component: () => import("@/views/ums/memberAddress/index"),
        name: "memberAddress",
        meta: { title: "会员收货地址", icon: "user" },
      },
      {
        path: "shoppingCart",
        component: () => import("@/views/ums/memberCart/index"),
        name: "shoppingCart",
        meta: { title: "购物车列表", icon: "user" },
      },
    ],
  },

  {
    path: "/system",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "user",
        component: () => import("@/views/system/user/index"),
        name: "user",
        meta: { title: "用户管理", icon: "user" },
      },
      {
        path: "role",
        component: () => import("@/views/system/role/index"),
        name: "role",
        meta: { title: "角色管理", icon: "user" },
      },
      {
        path: "menu",
        component: () => import("@/views/system/menu/index"),
        name: "menu",
        meta: { title: "菜单管理", icon: "user" },
      },
      {
        path: "dept",
        component: () => import("@/views/system/dept/index"),
        name: "dept",
        meta: { title: "部门管理", icon: "user" },
      },
      {
        path: "post",
        component: () => import("@/views/system/post/index"),
        name: "post",
        meta: { title: "岗位管理", icon: "user" },
      },
      {
        path: "dict",
        component: () => import("@/views/system/dict/index"),
        name: "dict",
        meta: { title: "字典管理", icon: "user" },
      },
      {
        path: "config",
        component: () => import("@/views/system/config/index"),
        name: "config",
        meta: { title: "参数设置", icon: "user" },
      },
      {
        path: "notice",
        component: () => import("@/views/system/notice/index"),
        name: "notice",
        meta: { title: "通知公告", icon: "user" },
      },
      {
        path: "/log/operlog",
        component: () => import("@/views/monitor/operlog/index"),
        name: "operlog",
        meta: { title: "操作日志", icon: "user" },
      },
    ],
  },

  {
    path: "/systemStatistics",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "",
        component: () => import("@/views/aws/systemStatistics/index"),
        name: "systemStatistics",
        meta: { title: "数据统计", icon: "user" },
      },
    ],
  }
]
```



