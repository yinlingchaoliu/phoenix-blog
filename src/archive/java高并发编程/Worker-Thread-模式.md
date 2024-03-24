---
title: Worker-Thread-模式
date: 2024-03-24 11:47:50
category:
  - java高并发编程
tag:
  - archive
---
线程池模式

线程池
本质一个线程安全工作队列连接工作者线程和客户端线程 

实现线程池的三步
1、实现线程安全的阻塞队列 (生产者-消费者范例)
```
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

```
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

```
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

juc

ThreadPoolExecutor线程池

ThreadFactory定制线程

Executors.newFixedThreadPool() 固定线程数

Executors.newCachedThreadPool() 缓存线程池

Executors.newScheduledThreadPool() 定时线程池
