---
title: Android-JNI实战用法
date: 2024-03-24 11:47:50
category:
  - 如何学习ndk
tag:
  - archive
---
####目录
[cmake快速实战](https://www.jianshu.com/p/f33988197f60)

[Android JNI基础知识讲解](https://www.jianshu.com/p/c86dce5a70b0)

[Android JNI实战](https://www.jianshu.com/p/a4022db636d5)

####1、前言
对于程序员来讲，最简单方式给对方代码看
我这边项目循序渐进参考借鉴孤云，写了一套native方法，由易变难，当你用到那块方面时候，可以直接取用demo

我承认是站在巨人肩膀上coding的，我只是力求更简单理解

项目地址：https://github.com/yinlingchaoliu/HowToLearnNdk

####2、jni基本操作
代码位置 jniapp模块下NativeLib

```
/**
 * jni代码编写 通过env特定转化函数
 * 建议jni调用用C封装好的函数，细节不要暴露在里面
 * 标准示例 包含各种写法
 */
public class NativeLib {

    static {
        System.loadLibrary( "native-lib" );
    }

    //示例demo
    public static native int plus(int a, int b);

    //字符串操作 hello world
    public static native String getNativeString(String str);

    //返回字符串
    public static native String getReturnString(String str);

    //打印字符串
    public static native void printf(String str);

    //获得源字符串的指针 只获得指针 用于读取 中间不能有阻塞操作
    public static native void printfCritical(String str);

    public static native int getLength(String str);

    public static native void printfRegion(String str);

    //操作数组
    public static native int intArraySum(int[] intArray, int size);

    //返回数组
    public static native int[] getIntArray(int num);

    //对象数组
    public static native int[][] getTwoDimensionalArray(int size);

    //java c++ 互相调用
    public static native void printAnimalsName(Animal[] animals);

    //访问类实例字段 set方法
    public static native void setAnimalName(Animal animal,String name);

    //访问静态字段
    public static native int getAnimalNum(Animal animal);

    //调用实例方法
    public static native void callInstanceMethod(Animal animal);

    //调用静态方法
    public static native String callStaticMethod(Animal animal);

    //构造方法 public String(char value[]) // Java String 类的其中一个构造方法
    public static native String newStringInstance();

    //构造方法 Animal(String name)
    public static native Animal invokeAnimalConstructor(String name);

    //构造方法 Animal(String name)  延迟初始化 AllocObject
    public static native Animal allocAnimalConstructor(String name);

    //调用父类方法
    public static native void callSuperMethod();

    //调用缓存字段 避免 FindClass GetFieldID ,GetMethodID重复调用

    //使用时缓存
    public static native void staticCacheField(Animal animal);

    //初始化缓存
    static {
        initCacheMethodId();
    }
    public static native void initCacheMethodId(); // 静态代码块中进行缓存

    public static native void callCacheMethod(Animal animal);

    // FindClass 是局部引用，不能static缓存
    //(*env)->DeleteLocalRef(env, jstr);

    //局部引用
    public static native void localRef();

    //全局引用
    public static native void gloablRef(Animal animal);

    //弱引用
    public static native void weakRef(Animal animal);

    //native 处理java异常
    public static native void nativeInvokeJavaException();

    //native 抛出java异常
    public static native void nativeThrowException() throws IllegalArgumentException;

}
```

####3、jni bitmap处理

```
public class NativeBitmap {

    static {
        System.loadLibrary( "native-lib" );
    }

    // 顺时针旋转 90° 的操作
    public native Bitmap rotateBitmap(Bitmap bitmap);

    public native Bitmap convertBitmap(Bitmap bitmap);

    public native Bitmap mirrorBitmap(Bitmap bitmap);
}
```

####4、posix线程操作

线程是对上面的一个综合运用，为了以后方便使用，写了一个标准用法，传入java方法 要实现runnable

```
/**
 * 编写一个通用库 用作示例
 * 使用传入方法必须实现run方法
 */
public class NativeThread {

    static {
        System.loadLibrary( "native-lib" );
        nativeInit();
    }

    //初始化资源
    private static native void nativeInit();

    //创建线程 用native执行java方法
    public static native void createNativeThread(Runnable runObj);

    //创建多线程
    public static native void posixThreads(Runnable runObj,int threadnum);

    //释放内存
    private static native void nativeFree();

    /**
     * Native 回到到 Java 的方法，打印当前线程名字
     *
     * @param msg
     */
    public static void printNativeMsg(String msg) {
        Log.d("NativeThread", "native msg is " + msg);
        Log.d("NativeThread","print native msg current thread name is " + Thread.currentThread().getName());
    }

}
```
