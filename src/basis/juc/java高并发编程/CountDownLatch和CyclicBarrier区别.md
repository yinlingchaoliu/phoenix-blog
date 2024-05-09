---
title: CountDownLatch和CyclicBarrier区别
date: 2024-03-24 11:47:50
category:
  - java高并发编程
tag:
  - juc
---

1、先并行再串行

countDown()-->await()
先计数减少，最后在串行

```java
CountDownLatch

main(){
  int TASK= 10;
  ExecuteService  service = Exectuors.newFixedThreadPool(5);
  CountDownLatch downLatch = new CountDownLatch(TASK);
  
  try{
  
    for(int i=0; i < TASK; i++){
      service.execute(new MyTask(downLatch, i));
    }
    print("-------AWAIT-------");
    downLatch.await();
    //此处之后串行操作

  }catch(Exception e){
    
    service.shutdown();
    print("-------END-------");
  
  }
}

```

Mytask
```java
public class MyTask implement Runnable{

  private  final CountDownLatch latch;
  private  final int count;
  
  public MyTask(CountDownLatch  latch, int count){
    this.latch = latch;
    this.count = latch;
  }

  public void run(){
    sleep(1);
    print("count="+count);
    latch.countDown();
  }

}
```

```bash
输出结果
-------AWAIT -------
------- count=0-------
------- count=1-------
------- count=2-------
------- count=3-------
------- count=4-------
...................
------- count=9-------
------- END-------
```

CyclicBarrier循环栏珊
