---
title: java并发核心机制和内存模型
date: 2024-03-24 11:47:50
category:
  - java高并发编程
tag:
  - archive
---
####1、java并发挑战
上下文切换、死锁、硬件和软件资源限制

#####上下文切换
任务状态从保存到再加载的过程是一次上下文切换
线程创建和上下文切换的会影响效率

检查工具
Lmbench3(性能分析工具)   测量上下文切换时长
vmstat（linux命令）  切换次数（cs）

解决方案：
* 减少上下文切换：
    1）无锁并发编程：减少使用锁，将数据分段，每个线程处理一段
    2）CAS算法：atomic  数值原子操作
* 减少线程
    1）使用最少线程：避免创建不需要线程

 实战，减少大量WAITING状态线程

1、jstack pid > txt , dump线程信息
2、统计线程状态
grep  "java.lang.Thread.State"  文件 | awk `{print $2$3$4$5}` |sort| uniq -c 

#####死锁定义·
如果一组进程中的每一个进程都在等待仅由该组进程中的其他进程才能引发的事件，那么该组进程是死锁的。

一句话解析：多个锁之间关系要同一层级对应，死锁原因锁之间关系是越层级等待

如何避免：
1、避免一个线程同时获取多个锁
2、避免一个线程内锁内同时只有多个资源
3、尝试定时锁 lock.tryLock(time)

#####资源限制定义
进行并发编程时，程序的执行速度受限于计算机硬件资源或者软件资源

资源限制引发问题
并行代码，受到资源限制，串行执行，那么上下文切换与资源调度极大浪费时间。

解决方案：
1、硬件资源，集群并行执行（带宽和硬盘）
2、资源池复用（连接数）

####2、java并发机制和原理
线程安全：如果一个对象可以安全被多个线程同时使用，那么它就是线程安全的
#####并发三个特性
* 原子性：是指一个操作或多个操作要么全部执行，且执行的过程不会被任何因素打断，要么就都不执行。

关键词：原子

* 可见性：当一个线程修改共享变量的值，其他线程能够立即得知这个修改

关键词：volatile 

* 有序性：即程序执行的顺序按照代码的先后顺序执行

关键词：先后顺序

#####volatile
实现原理
1、将当前处理器缓存行的数据写回到系统内存
2、这个写回内存的操作会使在其他cpu里缓存该内存地址的数据无效

#####synchronized
原理：jvm基于进入和退出Monitor对象来实现方法同步和代码块同步的

synchronized 重量锁
1、对于普通同步方法，锁是当前实例对象
2、对于静态同步方法，锁是当前类的Class对象
3、对于同步方法块，锁是synchonized括号里的配置对象

锁的级别，只可以升级，不能降级
从低到高：无状态锁、偏向锁、轻量级锁、重量级锁

#####原子操作
不可中断的一个或一系列操作

原理：
通过总线锁保证原子性 
使用缓存锁保证原子性 

#### 3、java内存模型（JMM）
并发编程关键问题：
1）共享内存  
2）消息传递  

#####指令重排：
在执行程序时，为提高性能，编译器和处理器会对指令重新排序

***插入内存屏障，来禁止指令重排序***

#####volatile修饰含义：
1、使用同一个锁对这些单个读/写操作做了同步
2、修饰变量指令禁止重排
3、多个volatile复合操作，不具有原子性。eg:volatile++

进阶：
[《java理论与实践 正确使用Volatile变量》](https://www.cnblogs.com/huichuan/archive/2013/06/14/3136033.html)

#####锁的内存语义：
锁可以让临界区互斥执行
从内存读取共享变量，而不是缓存

#####final域内存语义
1、在构造函数内对一个final域写入，与随后把这个被构造对象的引用赋值给一个引用变量，这两个操作之间不能重排序

2、初次读一个包含final域的对象引用，与随后初次读这个final域，这两个操作之间不能重排序

3、final引用不能从构造函数内“逸出” obj=this

4、被构造对象的引用在构造函数中没有“逸出”。
那么不需要使用同步就可以保证任意线程都能看到这个初始值

happens-before原则

JMM设计
偏好：
程序员： 强内存模型来编写代码
编译器：基于优化弱内存模型

原则
1、会改变程序执行结果的禁止重排序
2、不会改变程序结果的重排序

#####双重检查锁定错误
double-checked lock(双重锁定是错误的)
问题：当instance !=null 时，实例初始化未完成

问题根源：
```
instance = new Singleton()
memory = allocate() //1、分配内存空间
ctorInstance(memory)//2、初始化对象
instance = memory// 3、设置instance指向内存分配地址

第2、3步可能重排序
```
解决方案
1、禁止重排序
2、允许重排序，不容许其他线程“看到”

#####实战
######1、基于volatile解决方案 (禁止重排序)
```
public class SafeDoubleCheckedLocking{
    private volatile static Instance instance;
    public static Instance getInstance(){
        if(instance == null){
            synchronized(SafeDoubleCheckedLocking.class){
                if(instance == null){
                    instance = new Instance();
                }
        }
        return instance;
    }
}
```
######2、基于类初始化的解决方案
```
public class SingleFactory{
    private static class InstanceHolder{
        public static final Instance instance = new Instance();
    }

    public static Instance getInstance(){
        return InstanceHolder.instance;
    }
}
```
