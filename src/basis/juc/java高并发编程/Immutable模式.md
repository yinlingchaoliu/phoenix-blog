---
title: Immutable模式
date: 2024-03-24 11:47:50
category:
  - java高并发编程
tag:
  - archive
---
不改变模式

变量初始化后，不在改变

技巧：在构造函数中，初始化final变量
示例
```
public class Student{
  private final String name;

  public Student(String name){
       this.name = name;
  } 

  public String getName(){
    return name;
  }

}
```

JUC示例

copy-on-wirte 读写分离，写时复制
CopyOnWirteArrayList
