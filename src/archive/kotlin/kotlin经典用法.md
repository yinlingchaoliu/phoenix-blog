---
title: kotlin经典用法
date: 2024-03-24 11:47:50
category:
  - kotlin
tag:
  - archive
---
####kotlin模拟运行器
https://try.kotlinlang.org/

####惯用语法
* 函数定义

```
//有返回值
fun sum(a: Int, b: Int): Int {
    return a + b
}

//无返回值
fun printSum(a: Int, b: Int) {
println("sum of $a and $b is ${a + b}")
}
```

* 定义变量

```
//只读
val a: Int = 1

//变量
var x = 5
```
* 字符串模板 $

```
var a = 1 
val s1 = "a is $a"
```

* 条件表达式统一写法

```
if (a > b) {
        return a
} else {
        return b 
}
```

* 空值校验 null

当某个变量的值可以为 null 的时候，必须在声明处的类型后添加 ? 来标识该引用可为空
```
val str: String ?= null
```

* 数据类型检测

```
fun getStringLength(obj: Any): Int?{
    if(obj is String){
        return obj.length
    }
    return null
}
```

* 使用for循环

1、类似java增强for循环

```
//推荐这种写法
val items = listOf("apple", "banana", "kiwifruit") 
for (item in items) {
    println(item)
}
```
或

```
val items = listOf("apple", "banana", "kiwifruit") 
for (index in items.indices) 
{
    println("item at $index is ${items[index]}") 
}
```
或
```
for (i in array.indices) {
    println(array[i])
}

for ((index, value) in array.withIndex()) { 
    println("the element at $index is $value")
}
```

while循环方法
优点：对index进行精确控制
```
val items = listOf("apple", "banana", "kiwifruit") 
var index = 0
while (index < items.size) {
    println("item at $index is ${items[index]}")
    index++ 
}
```

区间方法
```
//升序
val n = 11
for (x in 1..n step 2) 
{ 
    print(x)
}
```
或
```
//降序
for (x in 9 downTo 0 step 3) 
{
    print(x) 
}
```

* 区间检测

1、是否在某范围内
```
val x = 10
val y = 9
if (x in 1..y+1) {
    println("fits in range") 
}
```

* when 表达式 (取代switch)

```
when (x) {
    1 -> print("x == 1") 
    2 -> print("x == 2") 
    else -> { // default
        print("x is neither 1 nor 2") 
    }
}
```

* 集合遍历

```
//推荐用法
for (item in items) {
    println(item)
}
```
或
```
//推荐用法
for ((key, value) in map) {
    println("$key -> $value")
}
```
或 判断集合是否包含
```
when {
    "orange" in items -> println("juicy")
    "apple" in items -> println("apple is fine too")
}
```

或 使用 lambda 表达式来过滤(filter)与映射(map)集合:

```
val fruits = listOf("banana", "avocado", "apple", "kiwifruit")

fruits
    .filter{ it.startsWith("a") }
    .sortedBy { it }
    .map { it.toUpperCase() }
    .forEach { println(it) }
```

* 创建对象 不需要“new”关键字

```
 val rectangle = Rectangle(5.0, 2.0)
```

####习惯用法
* 创建实体类

```
//推荐实体类要有默认参数
data class Customer(val name: String = "", var email: String = "")

var customer: Customer = Customer("chentong","7045xxx")
println(customer.toString())

var customer01: Customer = Customer(name="kk")
customer01.email = "1986xxx"    println(customer01.toString())

//强烈推荐这种写法 语义清晰
var customer02: Customer = Customer(name="tong",email="890xxx")
println(customer02.toString())

var customer03: Customer = Customer("03")
customer03.email = "1986xxx"
println(customer03.toString())

var customer04: Customer = Customer()
println(customer04.toString())
```
1）自带getter、setter、toString、hashcode方法
2）val(只读) 没有setter方法
3）如果生成的类需要含有一个无参的构造函数，则所有的属性必须指定默认值

* 函数默认参数

```
fun foo(a: Int = 0, b: String = "") { ...... }
```

* 过滤 list(filter 内是判断条件)

```
val listdata = listOf(1, 2, 3, -1)
println(listdata.toString())
    
var newdata = listdata.filter{ it > 0 } 
println(newdata.toString())
```

* map创建

```
//打印map
fun printMap(map: Map<String,Any?>){
    for ((key, value) in map) {
        println("$key -> $value")
    }
}

//强烈推荐第一种写法 语义清晰
var map = HashMap<String,Any?>()
map.put("chen","tong")
map.put("yang","yue")
printMap(map)

var map01 = mutableMapOf<String, Any?>()
map01["chen01"] = "tong"
map01["yang01"] = "yue"
printMap(map01)

var map02: HashMap<String,String> = HashMap()
map02.put("chen02","tong")
map02.put("yang02","yue")
printMap(map02)

var chen03 = "tong"
var yang03 ="yue"
var yuan03 = "dong"
//左key,右value    
var map03 = mutableMapOf("chen03" to chen03, "yang03" to yang03,"yuan03" to yuan03)
printMap(map03)

val map04: MutableMap<String, Any?> = mutableMapOf()
map04.put("chen04","tong")
map04.put("yang04","yue")
map04["yuan04"] = "dong"
printMap(map04)
```
**强烈推荐第一种写法**
原因：
1、简单少，语法清晰，
2、与java写法一致，上手成本低，易于理解
3、分辨map是到底哪种实现方式很重要

* list创建

```
//list打印
fun printList(list: List<Any?>){
    for (item in list) {
        println("$item")
    }
    println("===end===")
}

val lists = listOf("lists", "123", "456") 
//没有add方法
printList(lists)

//强烈推荐这种写法
var lists01 = ArrayList<String>()
lists01.add("lists01")
lists01.add("banana")    
printList(lists01)

val lists02: MutableList<String> = mutableListOf("lists02","02121")
lists02.add("testadd")
printList(lists02)

//推荐这种写法
var lists03: MutableList<String> = mutableListOf()
lists03.add("lists03")
lists03.add("676767")
printList(lists03)

```
**推荐第2、4种写法，清晰，简洁**

* 只读list map

```
val list = listOf("a", "b", "c")

val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

* 访问map

```
var map = HashMap<String,String>()
map.put("chen","tong")
map["zhang"] = "san"     

println(map.get("zhang"))    
println(map.get("chen"))

println(map["zhang"]) 
println(map["chen"])
```
快速访问推荐下面👇
```
println(map["key"]) 
map["key"] = value
```

* 延迟属性

```
val p: String by lazy { 
// 计算该字符串
}
```

* 创建单例

```
object Resource {
    val name = "Name"
}
```

#####安全判断
* if not null缩写

```
val lists = listOf("123")
println(lists?.size)
```

* if not null{} else{} 缩写

```
val lists = listOf("123")
println(lists?.size ?: "empty")
println("内容" ?: "empty")
println(null ?: "empty")
```

* if not null 

```
val lists = listOf("123")
lists?.let {
	// 代码会执行到此处, 假如data不为null
    println(lists.size)
}
``` 

* 返回 when 表达式

```
fun transform(color: String): Int { 
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
	} 
}

println(transform("Red"))

println(transform("1"))
```

* 单表达式用法

```
fun theAnswer() = 42
//等于
fun theAnswer(): Int {
    return 42
}
```

* 一个对象调用多种方法

```
class Turtle {
    fun penDown(){
    	println("penDown()")
    }
	
    fun penUp(){
    	println("penUp()")
	}
    
	fun turn(degrees: Double){
    	println("turn($degrees)" )
	}
    
	fun forward(pixels: Double){
    	println("forward($pixels)")
	}
}

val myTurtle = Turtle()
with(myTurtle) { // 画一个 100 像素的正方形
    penDown()
	for(i in 1..4) 
    {
        forward(100.0)
        turn(90.0)
    }
    penUp() 
}
```

*  **优先使用try 、if 与 when表达形式**

```
return if (x) foo() else bar()

return when(x) {
    0 -> "zero"
    else -> "nonzero"
}
```
下面代码不建议使用

```
if (x)
    return foo()
else
    return bar()

when(x) {
    0 -> return "zero"
    else -> return "nonzero"
}
```
if 适用两个条件 when 适用多个条件

####基础知识
数字面值中间加下划线，易于读
val oneMillion = 1_000_000

kotlin 不使用位运算

数组Array

* if 表达式 会返回值，或代码块中值

```
// 传统用法
var max = a
if (a < b) max = b

// 作为表达式
val max = if (a > b) a else b
```

*for循环 补充

```
for (i in array.indices) {
    println(array[i])
}

for ((index, value) in array.withIndex()) { 
    println("the element at $index is $value")
}
```


* 标签 @ 即跳转地址 不建议采用
合理使用 return 、break、continue取代

```
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // 局部返回到该 lambda 表达式的调用者，即 forEach 循环
        print(it) 
    }
	print(" done with explicit label") 
}
``` 


####类与对象


* 类的写法

```
class  Person{
    var name: String = "chentong" 
    
    //主构造函数    
    constructor()
    //主构造函数 初始化代码
    
    init{
        name = name + " from Init"
    }
    
    constructor(name: String){
        this.name = name+" from name"
    }
    
    constructor(name: String, from: String){
        this.name = name + " from " + from
    }

}  

var person = Person()
println(person.name)
    
var person01 = Person("yan")
println(person01.name)

var person02 = Person("kun"," China ")
println(person02.name)
```

* 类继承

```
open class Base(p: Int)
class Derived(p: Int) : Base(p)
```
* 方法覆盖

```
open class Base {
    open fun v() { ... }
    fun nv() { ... }
}
class Derived() : Base() {
    override fun v() { ... }
}
```
* 属性覆盖

```
open class Foo {
open val x: Int get() { ...... }
}
class Bar1 : Foo() {
    override val x: Int = ......
}
```

子类不覆盖基类open成员

#####抽象类


```
open class Base {
    open fun f() {}
}
abstract class Derived : Base() { override abstract fun f()
}
```

#####接口

**接口不建议写方法体，也不建议写属性字段**
**原则就是清晰，易懂无歧义**
```
interface MyInterface { 
    fun bar()
    fun foo() {// 可选的方法体} 
}

class Child : MyInterface { 
    override fun bar() {// 方法体 }
}
```
#####可见性修饰
private :文件内可见
protected :只在本类与子类可见，外界引用不可见
internal:能⻅到类声明的本模块内的任何客戶端都可⻅其 internal 成员（相同模块）
public ：默认是public


#####扩展

```
class C {
    fun foo(){println("member") }
}

fun C.foo(i: Int) {println("extension")}

```

####泛型

```
 class Box<T>(t: T) {
     var value = t
}

val box = Box<Int>()
```

形变
in/out
解决通配符问题

类型擦除

延时属性lazy 线程安全的

```
val lazyValue: String by lazy { 
    println("computed!") "Hello"
}

fun main(args: Array<String>) {
    println(lazyValue)  
    println(lazyValue)
}
```
