---
title: JNI基础知识讲解
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

####1、序言
学习ndk，就是为了更深入做图像识别，算法，人工智能领域
毕竟算法用C写保密性和效率比较好的，还是要将技术基本功再深入下去

C特点，处理字符串非常有优势，运行快，要充分利用

####2、开源demo
https://github.com/yinlingchaoliu/HowToLearnNdk

####3、JNI与NDK区别和学习思路
* JNI 全称是 Java Native Interface，即 Java 本地接口。它是用来使得 Java 语言和 C/C++ 语言相互调用的

* NDK 的全称是 Native Development Kit， 即C/C++开发工具包，它是用来做C/C++开发，提供了相关动态库

* 学习顺序
1)学习JNI
2)根据业务需求学习技术

####4、常用概念
#####1、JNIEnv
声明native方法 建议用static修饰
```
public static native int plus(int a, int b);
```
快捷键生成对应方法
```
extern "C"
JNIEXPORT jint JNICALL
Java_com_glumes_myapplication_NativeClass_plus(JNIEnv *env, jobject instance, jint a, jint b) {
    jint sum = a + b;
    return sum;
}
```
* JNIEnv 是 Java 虚拟机所运行的环境，通过它可以访问到 Java 虚拟机内部方法

* 2、类型对比

基本数据类型
| java类型  | native类型 |
|---------|----------|
| boolean | jboolean |
| byte    | jbyte    |
| char    | jchar    |
| short   | jshort   |
| int     | jnit     |
| long    | jlong    |
| float   | jfloat   |
| double  | jdouble  |
对应源码
```
typedef uint8_t  jboolean; /* unsigned 8 bits */
typedef int8_t   jbyte;    /* signed 8 bits */
typedef uint16_t jchar;    /* unsigned 16 bits */
typedef int16_t  jshort;   /* signed 16 bits */
typedef int32_t  jint;     /* signed 32 bits */
typedef int64_t  jlong;    /* signed 64 bits */
typedef float    jfloat;   /* 32-bit IEEE 754 */
typedef double   jdouble;  /* 64-bit IEEE 754 */
```

引用数据类型
| java类型  | native类型 |
|---------|----------|
| All objects | jobject |
| java.lang.Class    | jclass    |
| java.lang.String    | jstring    |
| Object[]   | jobjectArray   |
| boolean[]     | jbooleanArray     |
| byte[]    | jbyteArray    |
| java.lang.Throwable   | jthrowable   |
| char[]  | jcharArray  |
| short[]  | jshortArray  |
| int[]  | jintArray  |
| long[]  | jlongArray  |
| float[]  | jfloatArray  |
| double[]  | jdoubleArray  |

jni操作，建议用基本数据类型和jstring

####String 字符串操作
* java默认使用Unicode 编码
* C/C++默认使用UTF编码

GetStringUTFChars(jstring string, jboolean* isCopy)
转换为UTF编码

GetStringChars(jstring string, jboolean* isCopy)
转换为Unicode编码

env结构体 有对应函数引用
方法说明不介绍
![字符串函数](https://upload-images.jianshu.io/upload_images/5526061-98644241ba1f55c9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#####数组操作
```
转换函数
intArray = env->GetIntArrayElements(intArray_, NULL);
env->ReleaseIntArrayElements(intArray_, intArray, 0);

GetTypeArrayRegion / SetTypeArrayRegion
GetArrayLength
GetPrimitiveArrayCritical / ReleasePrimitiveArrayCritical

```

JAVA与JNI签名转换

1、Java类中“.”换成“/”
2、“[”表示数组，“[”表示一维数组，“[[”表示二维数组
3、引用类型，大写字母“L”开头，“;”结尾
4、方法类型转换，先方法内，后返回参数
5 、中间无空格


| 示例                 |      |
|--------------------|------|
| Ljava/lang/String; | 字符串  |
| I                  | Int  |
| [I                 | 一维数组 |
| [[I                | 二维数组 |

java基础类型

| java基础类型 | JNI对应描述 |
|----------|---------|
| boolean  | Z       |
| byte     | B       |
| char     | C       |
| short    | S       |
| int      | I       |
| long     | J       |
| float    | F       |
| double   | D       |
| void   | V       |

引用类型转换
| java引用类型  | JNI对应描述转换            |
|-----------|----------------------|
| String    | Ljava/lang/String;   |
| Class     | Ljava/lang/Class;    |
| Throwable | Ljava/lang/Throwable |
| int[]     | [I                   |
| Object[]  | [Ljava/lang/Object;  |

方法签名转换

| java类型                  | JNI对应描述转换             |
|-------------------------|-----------------------|
| String f();             | ()Ljava/lang/String;  |
| long f(int i, Class c); | (ILjava/lang/Class;)J |
| String(byte[] bytes);   | ([B)V                 |


####JNI引用管理
#####1、局部引用
局部引用会阻止 GC 回收所引用的对象，同时，它不能在本地函数中跨函数传递，不能跨线程使用。

局部引用不能用static缓存
否则函数退出，局部引用被释放，static变量会成为一个野指针

申请内存函数 NewObject  FindClass  NewObjectArray ,new开头函数
采用DeleteLocalRef 手动回收

回收建议：不用要第一时间释放

局部引用函数
* EnsureLocalCapacity

native方法 最少创建16个局部引用，复杂情况用EnsureLocalCapacity申请额外开销
```
int len = 20;
if (env->EnsureLocalCapacity(len) < 0) {
  // 创建失败，out of memory
}

for (int i = 0; i < len; ++i) {
    jstring  jstr = env->GetObjectArrayElement(arr,i);
}
```
* PushLocalFrame & PopLocalFrame配对使用
创建一个指定数量内嵌空间，在函数对之间局部引用都会在这个空间，释放后，这段空间内所有被释放掉
类似压栈出栈

```
int len = 10;
if (env->PushLocalFrame(len)) { // 创建指定数据的局部引用空间
 //out ot memory
}

//中间各种局部引用代码
//todo
 jstring  jstr = env->GetObjectArrayElement(arr,i);
//中间各种局部引用代码
//中间各种局部引用代码

//弹出所有局部引用
env->PopLocalFrame(NULL); 
```

#####2、全局引用
全局引用和局部引用一样，也会阻止它所引用的对象被回收。但是它不会在方法返回时被自动释放，必须要通过手动释放才行，而且，全局引用可以跨方法、跨线程使用。

全局引用可以用static保存
NewGlobalRef  DeleteGlobalRef

#####3、弱引用
弱全局引用有点类似于 Java 中的弱引用，它所引用的对象可以被 GC 回收，并且它也可以跨方法、跨线程使用。

isSameObject  //监测
NewWeakGlobalRef //新建
DeleteWeakGlobalRef //删除

isSameObject其他用途
```
env->IsSameObject(obj1, obj2) // 比较局部引用 和 全局引用是否相同
env->IsSameObject(obj, NULL)  // 比较局部引用或者全局引用是否为 NULL
env->IsSameObject(wobj, NULL) // 比较弱全局引用所引用对象是否被 GC 回收
```

总结：局部引用最好用PushLocalFrame & PopLocalFrame配对使用
NewLocalRef 可以保证返回一个局部引用
