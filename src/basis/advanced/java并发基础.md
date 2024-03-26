---
title: java并发基础
date: 2024-03-25 22:02:09
category:
  - 知识进阶
tag:
  - archive
---

##### 1、volatile和synchronized的区别
volatile本质是在告诉jvm当前变量在寄存器（工作内存）中的值是不确定的，需要从主存中读取； 
synchronized则是锁定当前变量，只有当前线程可以访问该变量，其他线程被阻塞住。

volatile仅能使用在变量级别；synchronized则可以使用在变量、方法、和类级别的
volatile仅能实现变量的修改可见性，不能保证原子性；而synchronized则可以保证变量的修改可见性和原子性

volatile不会造成线程的阻塞；synchronized可能会造成线程的阻塞。

volatile标记的变量不会被编译器优化；synchronized标记的变量可以被编译器优化

##### 2、通过静态内部类实现单例好处
1、不用synchronized，节省时间
2、懒加载，节省空间

##### 3、synchronized三种用法(此知识点常考)

对于普通同步方法，锁是当前实例对象
对于静态同步方法，锁是当前类Class对象
对于同步方法块，锁是synchrionized括号里配置对象

```
//锁的三种用法
public class SyncDemo {

    private Object lock = new Object();
    private static Object sLock = new Object();

    public synchronized void methodInstance() {
        System.out.println( "锁是当前实例对象" );
    }

    public synchronized static void methodClass() {
        System.out.println( "锁是当前类Class对象" );
    }

    public static void methodConfig() {
        synchronized (SyncDemo.class) {
            System.out.println( "锁是synchronized配置对象 - 当前类Class对象" );
        }
    }

    public static void methodConfig3() {
        synchronized (sLock) {
            System.out.println( "锁是synchronized配置对象" );
        }
    }

    public void methodConfig1() {
        synchronized (lock) {
            System.out.println( "锁是synchronized配置对象" );
        }
    }

    public void methodConfig2() {
        synchronized (this) {
            System.out.println( "锁是synchronized配置对象 - 当前实例对象" );
        }
    }

    public static void main(String[] args) {
        SyncDemo demo = new SyncDemo();

        //当前实例对象
        demo.methodInstance();
        demo.methodConfig2();
        System.out.println();

        //当前类Class对象
        SyncDemo.methodClass();
        SyncDemo.methodConfig();
        System.out.println();

        //配置对象
        SyncDemo.methodConfig3();
        demo.methodConfig1();
    }

}
```
