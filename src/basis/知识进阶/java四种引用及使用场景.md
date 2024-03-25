---
title: java四种引用及使用场景
date: 2024-03-25 22:02:09
category:
  - 知识进阶
tag:
  - archive
---
* 强引用（Strong Reference）：只要强引用在，即使在内存不足，也不会被回收。常见：创建新对象

* 软引用（SoftReference）:内存不足时会被回收。用于实现对内存敏感的高速缓存

* 弱引用（WeakReference）:只能生存到下一次垃圾回收之前，gc回收器发现它，就会被回收，用于引用占用内存空间较大的对象

* 虚引用（PhantomReference）:一个对象是否有虚引用存在，完全不会对其生存时间构成影响，也无法通过虚引用来取得对象实例，设置虚引用唯一目的能在这个对象被回收时收到一个系统通知

虚引用示例
```
   void testPhantomReference(){
        String str = new String( "test" );
        System.out.println(str.getClass() + "@" + str.hashCode());
        final ReferenceQueue<String> referenceQueue = new ReferenceQueue<String>(  );
        Thread thread = new Thread( new Runnable() {
            @Override
            public void run() {

                while (!Thread.interrupted()){
                    Object obj = referenceQueue.poll();
                    if (obj!=null){
                        try {
                            Field referent = Reference.class
                                    .getDeclaredField("referent");
                            referent(true);
                            Object result = referent(obj);
                            System.out.println("gc will collect："+ result.getClass() + "@" + result.hashCode() + "	" + (String) result);
                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                        }
                    }
                }
            }
        } );

        thread.start();
        PhantomReference<String> phantomReference = new PhantomReference<String>(str, referenceQueue);
        str = null;
        try {
            thread.join(3000);
            System.gc();
            Thread.currentThread().join(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        thread.interrupt();
    }
```
