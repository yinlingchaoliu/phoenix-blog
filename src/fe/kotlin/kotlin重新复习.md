---
title: kotlin重新复习
date: 2024-03-24 11:47:50
category:
  - kotlin
tag:
  - archive
---
####温故知新
将好的用法记录下来
流水账式记录

kotlin哲学
实用、精简、安全

原则：(DRY)
Don`t Repeat Yourself 


表达主体
```
fun max(a:Int, b:Int):Int = if(a>b) a else b
```

var 变量
val 不变量

类和属性
```
class Person(val name:String)
```

任意对象使用when，用when代替复杂if

is 类型监测，智能类型转换

ranges
```
val oneToTen = 1..10
```

kotlin遍历几种写法

in 检查范围

异常处理 ：try作为表达式

```
fun readNum(reader:BufferedReader){
    var number  = try{
        Interger.parseInt(reader.readLine())
    }catch(e:Exception){
        return null
    }
    printlin(number)
}
```
list函数
last()
max()

类扩展 :顶层属性扩展
```kotlin
package strings
fun String.lastChar():Char = get(length-1)
```

kotlin调用
```
var c = "abc".lastChar()
```

java调用扩展函数
```
char c = StringUtilKt.lastChar("abc")
```

多态在kotlin中失效的

可变参数
vararg

元组 pairs

split
```
"12.345-6.A".spilt(".".toRegex())
```

kotlin接口： 带有默认实现方法

open final abstract修饰符，默认final类型

可见性 
public默认  
internal 模块内可见
protected 子类可见
private 类内部可见 


初始化类：主构造器和初始化器

constructor
init{

}

次构造器

super(ctx)=>this(ctx)
get() 
set(value:String)

数据类
```
data class Client(val name:String , val code :Int)
```
copy 拷贝数据

by类委托  减少大量不必要实现
```

class DelegateCollection<T>(
    innerList:Conllection<T> = ArrayList<T>()
):Conllection<T> by innerList{}

```

object 单例类
无构造函数

伴生对象：访问静态函数，静态成员

```
class A{

    companion object{
          fun bar(){
          println("hello")
          }
    }

}

A.bar
```

匿名内部类
1、对象表达式
object : Clickable{

}

2、 lambda


lambda 应用
1、集合
```
var list =listOf(Person("a",12), Person("b",14))
list.maxBy{ it.age }
```
2、语法表达式
![语法表达式](https://upload-images.jianshu.io/upload_images/5526061-3e5584d21dab45f0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

成员引用
people::age

filter  移除不想要函数
map  对合集每个元素应用给定函数

```
var people = listOf(Person("Alice",20),Person("Bob",31))
people.filter{it.age > 30}
output=>[Person("Bob",31)]

var list = listOf(1,2,3,4)
list.map{ it * it }
[1,4,9,16]

```

对集合应用预言，条件判定
all 所有
any 任意
count 符合数量
find 返回符合第一个

```
var people = listOf(Person("Alice",20),Person("Bob",31))

var canBe27 ={p:Person->p.age <=27}

people.all(canBe27)
people.any(canBe27)
people.count(canBe27)
people.find(canBe27)
```

groupBy 一个将列表转化为多组映射

```
var people = listOf(Person("Alice",20),Person("Bob",31),
Person("Carol",31))

//分组
people.groupBy{it.age}
```

flatMap  数据变换重新排列
函数变换，多个列表合并一个集合
```
val strings = listOf("abcc","deffggrr")
println(strings.flatMap{it.toList()})

[a, b, c, c, d, e, f, f, g, g, r, r]
```

//转换为序列，数据量大时，会更高效  
sequence
```
people.asSequence()  //转换为序列
            .map(Person::name)
            .filter{ it.startsWith("A")}
            .toList() //序列转换成列表
```
优化，先用filter,后map

with函数   建造者
apply函数 
