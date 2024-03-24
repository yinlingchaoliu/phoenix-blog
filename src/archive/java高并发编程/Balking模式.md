---
title: Balking模式
date: 2024-03-24 11:47:50
category:
  - java高并发编程
tag:
  - archive
---
通过标志位，停止返回线程当前操作

```
public class Balking{
    private volatile boolean initFlag=false;

    public synchronized void init(){
      if(initFlag){
        return;
      }

      doSomething();
      initFlag=true;
    }

}
```
