---
title: java内存模型
date: 2024-03-25 22:02:09
category:
  - java并发编程艺术
tag:
  - archive
---
#### java内存模型基础
并发编程，两个关键问题：线程通信和线程同步
通信机制：共享内存和消息传递

java并发采用共享内存模型，通信是隐式调用的，
编写多线程出现内存可见性问题

![java内存模型](https://upload-images.jianshu.io/upload_images/5526061-d5fc919225927f0a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1）线程A把本地内存A更新过的共享变量刷新到主内存中去
2）线程B到主内存中去读取线程A之前已更新过共享变量

为提高性能，进行指令重排

happens-before
如果一个操作结果需要对另一个操作可见，那么这两个操作之间必须存在happens-before关系

as-if-serial语义：不管怎么重排序，程序的执行结果不能被改变。
为了遵循as-if-serial语义，编译器和处理器不会对存在数据依赖关系的操作做重排序

目标：在不改变执行结果的前提下，尽可能提高并行度

#### java内存模型一致性

1、一个线程中所有操作必须按照程序的顺序来执行
2、所有线程都只能看到一个单一操作执行顺序。在顺序一致性内存模型中，每个操作都必须原子执行且立刻对所有线程可见

```
JMM中，临界区内代码可以重排序
```

#### 同步原语
volatile内存语义
当一个volatile变量时，JMM会把本地内存中共享变量值刷新到主内存

防止指令重排

锁
临界区互斥执行，还可以让释放锁的线程向获取同一个锁的线程发生消息

锁内存含义

AbstractQueuedSynchronizer


![juc实现底层原理](https://upload-images.jianshu.io/upload_images/5526061-b31f8a35095d9c6f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

final内存含义

1、final修饰，在构造方法中，不能指令重排
2、初次读包含final域对象，与初次读对象中final域，不能指令重排
3、只要对象正确构造(没有内存溢出)，final修饰线程安全


Double Check
volatile作用：防止指令重排
```
memory = allocate() //1、分配对象内存空间
ctorInstance(memory) //2、初始化对象
instance = menory //3、设置instance为memory
```
2、3重排 ，导致instance未正确初始化


#### java内存模型设计
