---
title: Thread-Per-Message模式
date: 2024-03-24 11:47:50
category:
  - java高并发编程
tag:
  - juc
---
异步消息模式

代码实现：
client:委托人
```java
main(){
  Host host = new Host();
  host.request();
}
```

Host宿主
```java
public class Host{
    private final Helper helper = new Helper();
    public void request(){    
      //可优化为线程池
      new Thread(){
        public void run(){
          //耗时操作
          helper.handle();
        }
      }.start();
    }
}
```

Helper助手
```java
public class Helper{
  public handler(){
  //耗时操作
  }
}
```

提高吞吐量

JUC
```java
ThreadFactory创建Thread
Thread newThread(Runnable r)
隐藏线程创建过程


//Execuors获取ThreadFactory 
Executors.defaultThreadFactory()
快速创建Executor

Executor接口
Executor executor = new Executor();
executor.execute(Runnable r);

ExecutorService 接口

ExecutorService  executorservice = Executors.newCachedThreadPool();

executorservice.execute(Runnable r);
executorservice.shutdown();//关闭线程池

ScheduledExecutorService (调度服务)
ScheduledExecutorService ses = Executors.newScheduledThreadPool(5);

ses.schedule(Runnable r, long delay, TimeUnit unit)

Executors 创建线程池实例工具类
```