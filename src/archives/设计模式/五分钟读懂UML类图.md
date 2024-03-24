---
title: 五分钟读懂UML类图
date: 2024-03-24 11:47:50
category:
  - 设计模式
tag:
  - archive
---
简单🍳读懂UML类图

#####**一、类的表示方式**
在UML类图中，类使用包含类名、属性(field) 和方法(method)，用带有分割线的矩形划分

**1、类的属性表示方式**
* **可见性  名称 ：类型 [ = 缺省值]**
 中括号中的内容表示是可选的
其中可见性的三种符号表示：
1、 `+` ：表示public
2、`-` ：表示private
3、`#`：表示protected（default）

![](http://upload-images.jianshu.io/upload_images/5526061-312c565497f4a562.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如上图所示：一个Employee类，它包含name,age和email这3个属性，以及modifyInfo()方法，其中3个属性是私有的，方法是公有的

**2、类的方法的表示方式**
* **可见性  名称(参数列表) [ ： 返回类型]**
中括号中的内容表示是可选的

![](https://upload-images.jianshu.io/upload_images/5526061-9ca28bb1a0d75bb5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如上图所示的Demo类中，定义了3个方法：
1、public方法method1接收一个类型为Object的参数，返回值类型为void
2、protected方法method2无参数，返回值类型为String
3、private方法method3接收类型分别为int、int[]的参数，返回值类型为int

#####二、类与类之间关系的表示方式

1、关联关系

关联关系又可进一步分为单向关联、双向关联和自关联。

（1）单向关联（带箭头的直线表示）
一方单向持有成员变量
![](http://upload-images.jianshu.io/upload_images/5526061-dbfd47882d1c80b6.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

上图表示每个顾客都有一个地址，这通过让Customer类持有一个类型为Address的成员变量类实现。

（2）双向关联（不带箭头的直线表示）
双方各自持有对方类型的成员变量
![](http://upload-images.jianshu.io/upload_images/5526061-dc0c32827941f943.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

上图中在Customer类中维护一个Product[]数组，表示一个顾客购买了那些产品；在Product类中维护一个Customer类型的成员变量表示这个产品被哪个顾客所购买。

（3）自关联（带有箭头且指向自身的直线表示）
自己包含自己

![](http://upload-images.jianshu.io/upload_images/5526061-bffd34b86dc0d8c3.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

上图的意思就是Node类包含类型为Node的成员变量

2、聚合关系（带空心菱形和箭头的直线）
聚合关系强调是“整体”包含“部分”，但是“部分”可以脱离“整体”而单独存在

![](http://upload-images.jianshu.io/upload_images/5526061-c61e7cc1cfa977a9.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

比如上图中汽车包含了发动机，而发动机脱离了汽车也能单独存在。

3、组合关系（带实心菱形和箭头的直线表示）
组合关系与聚合关系见得最大不同在于：这里的“部分”脱离了“整体”便不复存在

![](http://upload-images.jianshu.io/upload_images/5526061-4aa9b7daf4a02aaf.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如上图，嘴是头的一部分且不能脱离了头而单独存在

4、依赖关系（带有箭头的虚线）

![](http://upload-images.jianshu.io/upload_images/5526061-0fa239b9a052f0e9.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

从上图所示，Driver的drive方法只有传入了一个Car对象才能发挥作用，因此我们说Driver类依赖于Car类。

5、继承关系（带空心三角形的直线表示）

![](http://upload-images.jianshu.io/upload_images/5526061-0afd3532d91d690a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如上图，Student类与Teacher类继承了Person类

6、接口实现关系（带空心三角形的虚线表示）

![](http://upload-images.jianshu.io/upload_images/5526061-f403a584a158cf5f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如上图，Car类与Ship类都实现了Vehicle接口

#####三、参考资料

[五分钟读懂UML类图](https://www.cnblogs.com/shindo/p/5579191.html)
[深入浅出UML类图](http://www.uml.org.cn/oobject/201211231.asp)
