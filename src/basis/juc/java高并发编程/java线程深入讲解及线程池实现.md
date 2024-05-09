---
title: java线程深入讲解及线程池实现
date: 2024-03-24 11:47:50
category:
  - java高并发编程
tag:
  - juc
---
### 1、基础概念

线程：程序执行流最小单元。
线程拥有各自计数器，堆栈，局部变量的属性，并且能够访问共享内存变量

注意：线程可以访问共享内存变量，高并发是指多线程对共享资源的原子操作。

线程优先级：1-10级，默认是5，高优先级分配时间片数量多于低优先级
```
Thread.setPriority(5);
```
注意：优先级不能作为程序正确性依赖，因操作系统差异

精灵进程：后台调度及支持性工作的进程

```
Thread.setDaemon(true);
```

### 2、线程状态

java线程状态6种：

| 线程状态 | 描述 |
| --- | --- |
| 初始状态(NEW)  | 新创建了一个线程对象，但还没有调用start()方法 |
| 运行状态(RUNNABLE) | Java线程中将就绪（ready）和运行中（running）两种状态笼统的成为“运行”。 |
| 阻塞状态(BLOCKED) | 表示线程阻塞于锁 |
| 等待状态(WAITING) | 进入该状态的线程需要等待 |
| 超时等待状态(TIME_WAITING) | 该状态不同于WAITING，它可以在指定的时间内自行返回 |
| 终止状态(TERMINATED) | 表示该线程已经执行完毕 |

![线程状态图](https://upload-images.jianshu.io/upload_images/5526061-9852cf763271acad.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 3、线程函数
| 函数名 | 作用 |
| --- | --- |
| sleep | 休眠，对象锁不会释放，不可以被interrupt（）中断 |
| join | 等待目标程序完成后再继续执行 |
| yield | 线程礼让，运行状态转为就绪状态，让出执行权 |
| interrupt | 中断线程 |
| IsInterrupted | 判断线程是否被中断 |

###  join与yield区别
join 线程之间顺序执行
yield 让出当前线程执行权

1. 启动线程之前，最好构建名字，便于定位

2. 中断理解：线程中断的标识位，由其他线程通知该线程，若当前线程sleep,则无法中断

3. 过期方法suspend、resume、stop不用。原因：陷入暂停、停止，线程不会释放占有资源，引发不确定性

4. 安全终止线程：
    1）interrupt中断
    2）用boolean变量控制
    
    实战示例
    
```java
//实现demo
private class WorkRunner implements Runnable{
    private volatile boolean switchFlag = true; // boolean变量线程安全且插入屏障
    
    public void run(){
        //两重判断，一个boolean，一个支持中断状态
        while(switchFlag && !Thread.currentThread().isInterrupted()){
            doSomething()
        }
    }

    public void cancel(){
        switchFlag = false;
    }
}

//调用者
main(){
    Thread thread = new Thread(new WorkRunner(), "work");
    thread.start()
    //两种中断方法
    thread.interrupt();
    thread.cancel();
}
```
     
### 对象锁

| 函数名 | 作用 |
| --- | --- |
| wait | 当前线程调用对象的wait()方法，当前线程释放对象锁，进入等待队列。 |
| wait(long timeout)  | 超时等待返回，单位毫秒 |
| wait(long,int) | 单位纳秒 |
| notify | 通知一个在对象上等待的线程，使其wait返回 |
| notifyAll | 通知所有等待线程在该对象的线程 |

**wait，notify等方法必须放在synchroized代码块中**

### 经典范例

### 等待-通知（生产消费者）
            
1. 消费者
    1）获取对象的锁
    2）条件不满足等待（wait），被通知后仍要检查条件
    3）条件满足执行
    
2. 生产者
1）获得对象的锁
2）改变条件
3）通知所有等待对象上的线程

伪代码
```
synchrionized(对象){
    while(条件不满足){
        对象.wait();
    }
    处理逻辑
}

synchionized(对象){
    改变条件
    对象.notifyAll()
}

```

### 实战编程

1、消费者 须增加超时设计

```
public synchrionized void fetch(){
    long future =   System.currentTimeMills()+mills;
    long remaining = mills;
    while( 条件 && remaining > 0){
        对象.wait(remaining);
        remaining = future - System.currentTimeMills();
    }
    处理逻辑
}
```
优点：避免方法执行时间过长，不会永久阻塞调用者

2、阻塞队列BlockQueue
阻塞队列用来给生产者与消费者解耦

3、线程池
本质一个线程安全工作队列连接工作者线程和客户端线程 

### 实现线程池的三步
1、实现线程安全的阻塞队列 (生产者-消费者范例)
```java
public interface BlockQueue<E>{
    void add(E e); //添加元素
    E take();      //取走元素
    E take(int timeout);
    int size(); //队列size
}

public ArrayBlockQueue<E> implement BlockQueue<E>{
    
    private List<E> blockList = new ArrayList();
    private Object lock = new Object();
    private volaitle int size = 0;
    
    //生产者
    public void add(E e){
        synchionized(lock){
            blockList.add(e);
            lock.notifyAll();   
        }
    }
    
    //消费者
    public E take(int timeout){
    
        synchionized(lock){
            if(timeout <= 0){
                while(blockList.isEmpty()){
                    lock.wait();
                }
            }else{
                long future = System.currentTimeMills()+timeout;
                long remaining = timeout;
                while(blockList.isEmpty() && remain > 0){
                    lock.wait(remaining);            
                    remaining = future - System.currentTimeMills();
                }                
            }
        return blockList.get(0);
    }
    
    //消费者
    public E take(){
        return take(0);
    }
    
    //获得当前队列大小
    public int size(){
        synchionized(lock){
            size = blockList.size();  
        }
        return size;
    }
    
}


```

2、编写执行者可安全终止的Worker

```java
public Worker<Job extend Runnable> implement Runnable{
    private volatile boolean switchFlag = true;
    private BlockQueue<Job> blockQueue;
    
    public Worker(BlockQueue queue){
        blockQueue = queue;
    }
    
    public void run(){
        while(switchFlag && !Thread.currentThread().isInterrupted()){
            Job job = blockQueue.take();
            job.run();
        }
    }
    
    public shutdown(){
        switchFlag = false;
    }
    
}

```

3、线程池框架

```java
线程池接口规范
public interface ThreadPool<Job extends Runnable>{
    //执行工作
    void execute(Job job);
    //关闭线程池
    void shutdown();
    //增加线程
    void addWorker(int num);
    //减少线程
    void removeWork(int num);
    //当前任务job数
    int getJobSize();
    //当前线程数
    int getThreadCount();
}


public SimpleThreadPool<Job extends Runnable> implement ThreadPool<Job>{

//任务阻塞队列
private BlockQueue<Job> blockQueue = new ArrayBlockQueue()<Job>;

//线程队列
private List<Worker> workerList = Collections.sysnchronizedList(new ArrayList<Worker>);

//最大线程数
private static final int MAX_WORK_NUM = 10;

//默认线程数
private static final int DEFAULT_WORK_NUM = 3;

public SimpleThreadPool(){
    addWorker(DEFAULT_WORK_NUM);
}

//执行任务
public void execute(Job job){
    blockQueue.add(job);
}

//关闭线程池
public void synchrionized shutdown(){
    for(Worker worker : workerList){
        worker.shutdown();
    }
}

//增加线程任务
public synchrionized void addWorker(int num){
   //当前线程数
   int threadNum = workerList.size();
      //限制创建线程数不能超过最大限度
      if(threadNum + num > MAX_WORK_NUM){
       num = MAX_WORK_NUM - threadNum ;
   }

   for(int i = 0; i < num ; i++){
        creatOneWorker();
   }
}

public synchrionized void removeWorker(int num){
    //当前线程数
   int threadNum = workerList.size();
   //最大删除数是当前线程数
   if(num > threadNum){
        num = threadNum;
   }

    //移除工作线程
    for(int i = 0; i < num ;i++){
        Worker worker = workerList.get(i);
        worker.shutdown();
        workerList.remove(worker);
    }

}

//当前线程数
public synchrionized int getThreadCount(){
    return workerList.size();
}

//获得当前任务数
public int getJobSize(){
    return blockQueue.size();
}

//创建一个线程
private void creatOneWorker(){
     //创建工作者
    Worker worker = new Worker(blockQueue);
    workerList.add(worker);
    Thread thread = new Thread(worker);
    thread.start();
}

}

```


ThreadPoolExecutor线程池

ThreadFactory定制线程

Executors.newFixedThreadPool() 固定线程数

Executors.newCachedThreadPool() 缓存线程池

Executors.newScheduledThreadPool() 定时线程池