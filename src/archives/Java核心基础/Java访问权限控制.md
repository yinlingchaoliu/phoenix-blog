---
title: Java访问权限控制
date: 2024-03-24 11:47:50
category:
  - Java核心基础
tag:
  - archive
---
default（friendly）：即默认的包访问权限
public：公开的访问权限，也称接口访问权限
private：私有的访问权限
protect：受保护的访问权限，又称继承访问权限

![](https://upload-images.jianshu.io/upload_images/5526061-2e2a6b59cfe724ca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####达成效果
1. 调用者不能访问到被调用者的实现细节
2. 修改被调用者的实现细节不影响调用者

####意义
一个对象对另一个对象了解最少，更能接近“低耦合”目标　
####相关几个修饰词
* static  即全局静态 ：实例共享只一个，使用无须实例化
* final   即最终 
       final类不能被继承，没有子类，final类中的方法默认是final的。
        final方法不能被子类的方法覆盖，但可以被继承。
        final成员变量表示常量，只能被赋值一次，赋值后值不再改变。
* static final 全局常量
* abstract 抽象
