---
title: 2020年Android面试题目总结和经验之谈
date: 2024-03-24 11:47:50
category:
  - Caliburn随笔
tag:
  - archive
---
####菜虫给我留念学习mark
2020年Android面试题目总结和经验之谈


####菜虫大佬催我上进
@北京_陈桐  jvm，线程与锁（synchroinze与lock，偏底层），hashMap原理碰撞扩容（建议反复看源码），view绘制流程（非自定义view），handler（底层+Threadlocl），进程间通信（aidl、binder原理机制（mmap）），面向对象6大原则，设计模式、高性能编程，优化，算法


1.	百度面试
1.1	jvm加载原理
1.2	全局变量和局部变量区别
1.3	方法锁和静态锁的区别
1.4	子类继承父类，子类和父类里面都有静态变量，构造方法，普通方法， 当jvm加载的时候是如何执行的
1.5	handler机制，本地线程是用来干嘛的
1.6	单例模式的几种写法
2.	完美世界面试
2.1	16位字节变量都有哪些
2.2	死锁是什么，举例
2.3	静态变量锁和方法锁的区别
2.4	事件分发，dispatch和intercept和ontouchevent是如何执行的， onTouchEvent是如何执行的
2.5	场景1：addView方法加载A布局然后remove（A），然后addView（B布局）方法执行 场景2：addView方法加载A然后addView（B）， requestView方法在场景1和2分别是如何执行的， 各自执行效率如何
2.6	 布局A经过scale进行属性缩放， 缩放之后y轴对应的点坐标有没有变化
2.7	都用过哪些布局，constentLayout用过吗
2.8	int变量位移几位，如何执行的
2.9	utf-8和Unicode编码区别
2.10	 数组和链表区别
2.11	 rxjava中map和flapmap区别
2.12	 constraintLayout用法
3.	腾讯音视频部门面试
3.1	viewGroup和view的onDraw方法区别
3.2	recycleview的缓存机制，item不可见时是否会执行onBind方法
3.3	requestLayout、measureLayout、invalidate区别
3.4	图片压缩加载
3.5	sql语句left join和right join区别
4.	百度车联网面试题
1.	项目中的设计模式，对设计模式怎么理解的
2.	进程间通讯
3.	单例模式双重校验机制
4.	内存优化
5.	jvm相关
6.	ANR相关
度小满面试：
1.	线程间怎么通信的
2.	怎么做的webview
3.	算法：输入一个整形数组和一个target值，输入数组里面两个数，两者之和等于target
4.	hashmap怎么实现的 拓展大小机制是什么样的？
5.	图片压缩：宽高压缩和质量压缩；
6.	讲一讲https的ssl
7.	构造方法可以被复写吗
8.	static方法可以被复写吗
oppo面试（小游戏部门）：
1.	进程间通信哪些，binder机制底层
2.	activity里面setContentView做了什么
3.	activity window saface三者区别
4.	listview和recycleview区别
5.	多线程有哪些？参数有哪些
6.	线程有方式创建
7.	做了哪些性能优化
8.	讲一讲事件分发
9.	讲一讲如何绘制view的，流程，每一步都做了什么
10.	有没有封装过组件
11.	内存优化，引用是谁的引用，层次说一下
12.	rgb556 占多少字节
13.	sychonized和lock区别
14.	 sleep和wait（）区别
15.	讲讲okhttp
16.	leakcanary底部怎么实现的
17.	parcel和serilizable区别

快手
1.	hashmap实现原理，哈希值一样如何储存的，如何查找其中一项，时间复杂度多少？
2.	讲一讲voilate和sychnroized？
3.	Recycleview四级缓存，自定义缓存如何做的？
4.	View是如何绘制的？不能只说绘制的三个方法，如何通知到要去绘制的？
5.	GC回收机制，是如何知道哪个对象该被回收的？
6.	算法：输入两个链表，让其合一起输出一个链表

番茄一面
https://www.notion.so/59cafae8d24844c0b9b39bcc86b478ae

阿里
## 2020 5.19 15:00阿里一面

*   [Component](https://www.notion.so/Component-d2c3f90a85894ccfb935cf7c86de2e71)相关

*   你们是如何解决跨模块调用的

*   说说 RxJava 的线程切换是如何实现的. 见 [RxJava 面试题](https://www.notion.so/RxJava-1ed280f4185348f285cd13091637087c)

*   [ArrayList](https://www.notion.so/ArrayList-18bc732c363a43af90f0f09caff2dd4a)和 [LinkedList](https://www.notion.so/LinkedList-537bb6fb18a94f3989a91b632945680a)的区别

*   说说 [HashMap](https://www.notion.so/HashMap-add31c2da3c34c818035f6b4188fe300)的数据结构

*   N 个整数, 在不使用循环的前提下. 取最大的前五个. 实则是 Top K 的问题

    *   使用 [堆](https://www.notion.so/528701907958473cae985601dff77e60)这个数据结构.
    *   把 100 个整数都放进堆里面, 然后取前 N 个就行了
    *   也可以使用现成的 [PriorityQueue](https://www.notion.so/PriorityQueue-8f4c3da6642c47cdb5ff51d59037dde8)这个优先级队列. 内部就是用堆实现的.
    *   LeetCode 上相关的题目：[](https://leetcode-cn.com/problemset/all/?search=top)[https://leetcode-cn.com/problemset/all/?search=top](https://leetcode-cn.com/problemset/all/?search=top)
*   二叉搜索树的查询效率取决于什么？

    取决于树的高度, 所以树需要一些平衡的操作. 降低树的高度. 让树平衡

## 2020 5.20 14:00字节跳动一面

*   [Component](https://www.notion.so/Component-d2c3f90a85894ccfb935cf7c86de2e71)相关

*   说说 RxJava 的线程切换是如何实现的. 见 [RxJava 面试题](https://www.notion.so/RxJava-1ed280f4185348f285cd13091637087c)

*   说说 [HashMap](https://www.notion.so/HashMap-add31c2da3c34c818035f6b4188fe300)的数据结构

*   说说 View 的绘制流程, 不是单单指 View 的 draw. 整个过程

*   为什么匿名内部类使用外部变量, 变量需要使用 final

    防止后续的代码去改变变量的引用的地址. 造成数据的不一致性. 但是一些引用对象内部的属性值还是可以被改变的. 只是保证了被 final 修饰的变量指向的地址不会被改变

*   说说平衡二叉树和红黑树的区别

    *   见 [平衡二叉树和红黑树的区别](https://www.notion.so/5462e2f23894481194c8b2c4a12f2f49)
    *   see [Red-Black Tree](https://www.notion.so/Red-Black-Tree-a784ccb534c246389b39a6cdb4248058)And [AVL Tree](https://www.notion.so/AVL-Tree-33fe0200c2e84a4cb2a5ed54e86a8e5b)
*   快速排序的实现

    [快速排序](https://www.notion.so/a499e6d663e04085bcf3c9f9826af9db)

*   爬楼梯问题, 每次怕1,2节楼梯, N 节楼梯有多少种可能

    这个比较简单就不写了, 自己去看吧. 一种是递归、一种是动态规划 dp(n) = dp(n - 2) + dp(n - 1)

    代码：[](https://github.com/xiaojinzi123/MyLeetcode/blob/472b38081bf41c617c4b6379f5666e01e950614d/src/main/java/com/xiaojinzi/Answer_34_%E7%88%AC%E6%A5%BC%E6%A2%AF.java)[https://github.com/xiaojinzi123/MyLeetcode/blob/472b38081bf41c617c4b6379f5666e01e950614d/src/main/java/com/xiaojinzi/Answer_34_爬楼梯.java](https://github.com/xiaojinzi123/MyLeetcode/blob/472b38081bf41c617c4b6379f5666e01e950614d/src/main/java/com/xiaojinzi/Answer_34_%E7%88%AC%E6%A5%BC%E6%A2%AF.java)

*   一副扑克牌, 大小王可以算任意牌. 问随机抽 N 张牌. 判断其是否是连续的. 花色不同也可.

    [](https://github.com/xiaojinzi123/MyLeetcode/blob/master/src/main/java/com/xiaojinzi/Answer_32_%E5%88%A4%E6%96%AD%E9%A1%BA%E5%AD%90.java)[https://github.com/xiaojinzi123/MyLeetcode/blob/master/src/main/java/com/xiaojinzi/Answer_32_判断顺子.java](https://github.com/xiaojinzi123/MyLeetcode/blob/master/src/main/java/com/xiaojinzi/Answer_32_%E5%88%A4%E6%96%AD%E9%A1%BA%E5%AD%90.java)

*   首屏广告 SDK 的设计

    由于我们之前都不复杂并且没有啥难度, 所以当时没有 get 到面试官的点. 可能面试官遇到的都是很复杂的了. 他讲了一些：

    1.  广告的显示问题, 比如网络差, 无网络等
    2.  广告的收益性
    3.  ... 忘了

    后面我抽空去查资料补上
