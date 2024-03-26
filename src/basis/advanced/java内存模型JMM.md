---
title: java内存模型JMM
date: 2024-03-25 22:02:09
category:
  - 知识进阶
tag:
  - archive
---
![java内存模型](https://upload-images.jianshu.io/upload_images/5526061-4938e77b7845d370.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Java 线程之间的通信总是隐式进行，并且采用的是共享内存模型。
这里提到的共享内存模型指的就是 Java 内存模型(简称 JMM)，JMM 决定一个线程对共享变量 的写入何时对另一个线程可见。
从抽象的角度来看，JMM 定义了线程和主内存之间的抽象关系:线程之间的共享变量存储在主内存(main memory)中，每 个线程都有一个私有的本地内存(local memory)，本地内存中存储了该线程以读/写共享变量的副本。
本地内存是 JMM 的一个抽象概念，并不真实存在。它涵 盖了缓存，写缓冲区，寄存器以及其他的硬件和编译器优化。
