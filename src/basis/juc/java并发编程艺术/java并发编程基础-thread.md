---
title: java并发编程基础-thread
date: 2024-03-25 22:02:09
order: 4
category:
  - java并发编程艺术
tag:
  - archive
---
java线程状态
![java线程状态](https://upload-images.jianshu.io/upload_images/5526061-afcd2d54cc92d0b6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![状态变化](https://upload-images.jianshu.io/upload_images/5526061-f516b3de58100898.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

线程优先级不能正确执行
Daemon线程
finally 块代码不能清理做清理或关闭逻辑
中断 interrupt:是一个线程的标识位

优雅的终止线程
```
    class Runner implements Runnable {

        private volatile boolean on = true;

        @Override
        public void run() {

            //中断退出
            while (on && !Thread.currentThread().isInterrupted()){ //循环判断
                // todo  working
            }

        }

        //关闭线程
        public void cancel(){
            on = false;
        }
    }
```

线程通信
sync 和 volatile
等待通知
![image.png](https://upload-images.jianshu.io/upload_images/5526061-e11fb4172baeaaaa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

生产者消费者范式
1. 消费者
 1）获取对象的锁
 2）条件不满足等待（wait），被通知后仍要检查条件
 3）条件满足执行
    
2. 生产者
1）获得对象的锁
2）改变条件
3）通知所有等待对象上的线程

```
/**
 * 生产者-消费者
 */
public class WaitNotify {

    private Object lock = new Object();

    private volatile boolean flag = true;

    //生产者
    public void produce() {

        synchronized (lock) {

            //todo 代码执行逻辑



            flag = false;
            lock.notifyAll();
        }

    }

    //消费者
    public void consume() {

        synchronized (lock) {

            while (flag) {
                try {
                    lock.wait(); //线程进入waitting状态, 会释放对象锁
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            flag = true;

            //todo 执行逻辑


        }

    }

}
```

管道输入/输出流

```
public class Piped {

    private PipedWriter out;
    private PipedReader in;

    public Piped() throws IOException {
        out = new PipedWriter();
        in = new PipedReader();
        //输入流于输出进行连接
        out.connect( in );
    }

    public void write() throws IOException {
        int receive = 0;
        //读取 系统输入流
        while ((receive = System.in.read()) != -1) {
            out.write( receive );
        }
    }

    public void read() throws IOException {
        int receive = 0;
        while ((receive = in.read()) != -1) {
            System.out.print( (char) receive );
        }
    }

}
```
