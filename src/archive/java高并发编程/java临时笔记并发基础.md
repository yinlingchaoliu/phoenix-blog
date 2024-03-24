---
title: java临时笔记并发基础
date: 2024-03-24 11:47:50
category:
  - java高并发编程
tag:
  - archive
---

####临时笔记
http://ifeve.com/concurrentlinkedqueue/
#java并发编程基础
线程优先级
Priority

jstack工具查看状态
jps 查看列表
jstack pid

线程状态
初始(NEW)：    新创建了一个线程对象，但还没有调用start()方法。
运行(RUNNABLE)：Java线程中将就绪（ready）和运行中（running）两种状态笼统的成为“运行”。
阻塞(BLOCKED)：表线程阻塞于锁。
等待(WAITING)：进入该状态的线程需要等待其他线程做出一些特定动作（通知或中断）。
超时等待(TIME_WAITING)：该状态不同于WAITING，它可以在指定的时间内自行返回。
终止(TERMINATED)：表示该线程已经执行完毕。
[图片上传失败...(image-dbcd3-1535531273194)]

[线程状态图](https://img-blog.csdn.net/2018070117435683?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BhbmdlMTk5MQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

Daemon进程
精灵进程
```
Thread.setDaemeon(true)
```
在进程启动之前设置

线程初始化
1、daemon
2、priority
3、name
4、本地数据
5、线程ID

最好自定义线程名字

理解中断
线程的一个标识位属性，
interrupt()中断
interrupted() 复位


Thread.isInterrupted()
sleep() 方法不能被中断

过期方法 suspend(暂停) 、resume(恢复)、stop(停止)
死锁、不会释放资源

安全终止线程
中断状态是线程的一个标识位，而中断操作是一种渐变的线程间交互方式
1、interrupt() 中断
2、boolean值变量来控制是否需要停止任务并且终止
flag && Tread.currentThread().isInterrupted()

推荐第二种：清理资源

线程间通讯
**1、**volatile、synchronized
**2、**wait/notify
[图片上传失败...(image-5475ff-1535531273194)]


生产者-消费者

等待方-通知方
1、获取对象的锁
2、条件不满足等待（wait），被通知后仍要检查条件
3、条件满足执行

1、等待方
synchrionized(对象){
    while(条件不满足){
        对象.wait();
    }
    处理逻辑
}
2、通知方
1、获得对象的锁
2、改变条件
3、通知所有等待对象上的线程
synchionized(对象){
    改变条件
    对象.notifyAll()
}

3、**管道输入/输出流**
线程之间数据传入
PipedReader / PipedWriter 
PipedOutputStream / PipedInputStream
需要connect()绑定
out.connect(in)

4、Thread.join()
当前线程，等待上一个终止后再开始

5、ThreadLocal使用 线程变量

实战用法
等待超时模式

synchrionized void get(){
long future = System.currentTimeMills()+mills;
long remaining = mills;
    while(result == null && remaining > 0){
        对象.wait(remaining);
        remaining = future - System.currentTimeMills();
    }
    处理逻辑
}

增加超时控制

countDownLatch 预备-同时

线程池
一个线程安全工作队列连接工作者线程和客户端线程 
生产者-消费者

#java中的锁
juc
使用和实现两个方面

lock接口
锁是用来解决多个线程访问共享资源的方式

synchionized 隐式调用


Lock lock = new ReentrantLock();
lock.lock();
try{
    doSomething()
}finally{
    lock.unlock();
}

队列同步器 AbstractQueuedSynchrionizer
getState()
setState(int status)
compareAndSetStatus(int expect,int update) 设置cas状态

独占锁（互斥锁）
Mutex

重入锁（条件锁）
支持一个线程对资源重复加锁
ReentrantLock

公平锁与非公平锁问题
时间(FIFO先进先出原则)，条件

排他锁

读写锁
读写（锁）分离
ReentrantReadWriteLock 
使用场景：读多于写的
3个特性：
公平性选择（加条件）
重进入
锁降级:写锁降级为读锁

readLock()
writeLock()

写法：
锁降级: 需要再确认一下
readLock.lock()
try{
    //先释放
    readLock.unlock()
    //写锁
    writeLock.lock()
    try{
        
        readLock.lock()
    }finally{
        writeLock.unlock()
    }
}finally{
    readLock.unlock();
}

LockSupport工具
阻塞或唤醒线程

Condition接口 (条件)

Lock lock = new ReentrantLock()
Condition condition = lock.newCondition();

public void conWait(){
    lock.lock();
    try{
        condition.await();
    }finally{
        lock.unlock();
    }
}

public void conSigal(){
    lock.lock();
    try{
        condition.sigal();
    }finally{
        lock.unlock();
    }
}

#并发容器和框架
####1、ConcurrentHashMap 是线程安全且高效的HashMap
锁分段技术
1、线程不安全Hashmap，陷入死循环
2、效率低下的HashTable
锁分段技术
首先将数据分成一段一段的存储，并给每段数据配一把锁
当一个线程占用锁访问其中一段数据时，其他段数据也能被其他线程访问

####ConcurrentLinkedQueue
线程安全队列
阻塞和非阻塞算法

####Java阻塞队列

重点看

线程池的使用

*简单线程池实现

Executor 工作单元与执行单元分离


#java并发实践

生产者--消费者

mark 阻塞队列用来给生产者与消费者解耦

LinkedBlockingQueue

一个生产者--多个消费者

线程池与生产消费者模式

线上问题定位
top命令
top  1 
top H

CPU占用率高，top前10

jstat -gcuutil pid  1000  5 
把线程dump下来
jstack pid  > txt

nid线程

10进制转16进制
printf "x
" nid


性能测试
响应时间（RT）
吞吐量（TPS）  反比关系
并发数 承载多少用户操作
QPS 每秒查询数

QPS必须是峰值

netatat -nat | grep  port -c 

ps -eLf | grep java -c 

增加 线程数、CPU、机器

1、查看网络流量
cat /proc/net/dev
查看平均负载
cat /proc/loadavg
查看系统内存情况
cat /proc/meminfo

查看cpu利用率
cat /proc/stat


异步线程池
场景：集群环境，解决线程池重启问题

任务池--多线程池
任务状态
创建（NEW）
执行（EXECUTING）
重试(RETRY)
挂起（SUSPEND）
中止（TERMNER）
执行完成（FINISH）
















   
