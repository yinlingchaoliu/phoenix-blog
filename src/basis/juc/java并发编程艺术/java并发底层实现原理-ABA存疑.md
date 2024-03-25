---
title: java并发底层实现原理-ABA存疑
date: 2024-03-25 22:02:09
category:
  - java并发编程艺术
tag:
  - archive
---
#### 并发三要素
原子性：不可被中断的一个或一系列操作
可见性： 当一个线程修改一个共享变量时，另一个线程能读到修改的值
有序性：

#### volatile应用

volatile 可见性

```
volatile instance = new Singleton()

//汇编指令
movb $0x0 , 0x1104800(%esi)
lock addl $0x0 ,(%esp)
```
Lock前缀多处理器效果
1、将当前处理器缓存行的数据写回系统内存
2、这个写回内存的操作会使其他CPU里缓存了该地址数据无效


synchronized 重量级锁
jvm基于进入和退出Monitor对象来实现方法同步和代码块同步
指令 monitorenter 开始
指令 monitorexit 结束 异常处
任何对象都有一个monitor与之关联，当一个monitor被持有，处于锁定状态

用法
```
public class SyncDemo {

    Object A = new Object();

    public synchronized void method() {
        System.out.println( "锁是当前实例对象" );
    }

    public synchronized static void method1() {
        System.out.println( "锁是当前类Class" );
    }

    public void method2() {
        synchronized (A) {
            System.out.println( "锁是synchronized配置对象" );
        }
    }

    public static void main(String[] args){
        SyncDemo demo = new SyncDemo();
        demo.method();
        demo.method2();
        SyncDemo.method1();
    }

}
```

####java对象头
1byte = 8bit
1word(字宽) = 4 byte = 32bit
java对象头
![对象头](https://upload-images.jianshu.io/upload_images/5526061-372ba1f68a17b1b2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 1 大小 
数组类型 3 word
非数组类型 2 word （相差arraylength）

* 对象头包含 MarkWord ，Address ,length

Mark Word结构
![Mark Word结构](https://upload-images.jianshu.io/upload_images/5526061-ecb81058f7340350.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

运行期间，Mark Word存储数据会随着锁标志位变化而变化
![锁标志位决定存储数据](https://upload-images.jianshu.io/upload_images/5526061-bc3b629aa946405a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### 锁的升级与对比
减少获得锁和释放锁带来性能消耗，引入“偏向锁”和“轻量级锁”
锁的级别：无锁状态 < 偏向锁状态 < 轻量级锁状态 < 重量级锁状态

锁可以升级，但不能降级

###### 偏向锁
同一线程多次获得锁，采用代价更低偏向锁。
偏向锁thread ID 在Mark Word标记
1、第一次进入同步块，Mark Word记录偏向锁thread ID
2、下次进入test Thread ID  成功 获得锁，失败 升级为CAS

偏向锁撤销
等待竞争出现才释放锁的机制。所以当其他线程尝试竞争偏向锁时，持有偏向锁的线程才会释放锁，偏向锁的撤销，需要等待全局安全点。

tip:偏向锁是java 6 7默认启用，应用程序启动存在几秒延时。
关闭延时: -XX:BiasedLockingStartupDelay=0
关闭偏向锁：-XX:-UseBiasedLocking=false,默认进入轻量级锁状态

######  轻量级锁

Displaced Mark Word: 对象头Mark Word 复制到线程栈帧锁记录

加锁：尝试使用CAS将对象头Mark Word指向锁记录指针，成功获得锁，失败使用自旋锁

解锁：使用CAS操作将Displaced Mark Word替换回到对象头，成功，表示没有竞争发生，失败存在锁竞争，升级为重量级锁

###### 锁的优缺点比较
![锁的优缺点比较](https://upload-images.jianshu.io/upload_images/5526061-d777d8eb0c418568.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


####原子操作实现原理
CAS(Compare And Swap)

* 1、总线锁定保证原子性

```
多处理器同时对共享变量进行读改写操作（非原子操作）,操作完之后共享变量值会和预期不一样 
eg:
    i++
```
处理器提供LOCK#信号，当一个处理器在总线上输出此信号时，其他处理器请求将被阻塞住，该处理器可以独占共享内存

总线锁是将CPU和内存之间通信锁定，锁定期间，其他CPU不能操作其他内存数据，总线锁开销比较大

* 2、缓存锁定保证原子性
同一时刻，只需要对某个内存地址操作原子性即可

缓存一致性机制保证原子性
阻止两个以上处理器对缓存操作
其他处理器回写已锁定缓存，会使缓存行失效

lock前缀指令
```
修改指令：BTS、BTR、BTC
交换指令：XADD、CMPXCHG
逻辑指令：ADD、OR
```

* 3、其他两种情况不能采用缓存锁定
1、操作数据不能被缓存处理器内部，或者操作数据跨多个缓存行(cache line)
2、不支持缓存锁定

###### java如何实现原子操作
通过锁和循环CAS的方式实现原子操作

* 1、循环CAS
jvm 中CAS操作利用CMPXCHG指令实现

```
    private AtomicInteger atomicI = new AtomicInteger( 0 );
    //循环CAS
    public void safeCount() {
        for (; ; ) {
            int i = atomicI.get();
            //cas  期望值  更新值
            boolean suc = atomicI.compareAndSet( i, ++i );
            if (suc)
                break;
        }
    }
```
CAS三大问题
1、ABA问题：解决问题，使用版本号，在变量前追加版本号
AtomicStampedReference
A->B->A => 1A->2B->3A
ABA解决方案
```
    private AtomicStampedReference<Integer> atomicStampedRef = new AtomicStampedReference<Integer>( 0,0 );
    public void safeABACount() {
        for (;;){
            //当前值
            int ref = atomicStampedRef.getReference();
            //版本
            int stamp = atomicStampedRef.getStamp();
            boolean suc = atomicStampedRef.compareAndSet( ref, ++ref, stamp, stamp + 1 );
            System.out.println( suc + " ref = " + ref + " stamp = " + stamp );
            if (suc)
                break;
        }
    }
```

`此处存在疑惑`
ABA解决方案问题：stamp 版本号上限128 超过之后报错
只能作为解决方案思路

2、循环时间开销大
3、只能保证一个共享变量原子操作

* 2、锁机制实现原子操作
偏向锁、轻量级锁、互斥锁，除偏向锁外，实现原理均采用循环CAS


####juc编程源码
https://github.com/yinlingchaoliu/juc
