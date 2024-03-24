---
title: 17、ClassLoader原理
date: 2024-03-24 11:47:50
category:
  - 手动编写jvm虚拟机
tag:
  - archive
---
[gojvm目录](https://www.jianshu.com/p/cb8fe1f365be)
[1、搭建go环境](https://www.jianshu.com/p/9156bc2bbeba)
[2、cmd命令行参数解析](https://www.jianshu.com/p/bea27c053053)
[3、搜索class文件](https://www.jianshu.com/p/e76c793b5981)
[4、添加testOption 便于单元测试](https://www.jianshu.com/p/aec9576f08f8)
[5、解析classfile文件](https://www.jianshu.com/p/97756f2820a8)
[6、运行时数据区](https://www.jianshu.com/p/682b548e24a3)
[7、指令集](https://www.jianshu.com/p/9775be0d790e)
[8、解释器](https://www.jianshu.com/p/e924ac1da848)
[9、创建Class](https://www.jianshu.com/p/072fd852418c)
[10、类加载器](https://www.jianshu.com/p/ba231854662d)
[11、对象实例化new object](https://www.jianshu.com/p/f870bb0959c8)
[12、方法调用和返回](https://www.jianshu.com/p/614cdc94ecd0)
[13 类初始化](https://www.jianshu.com/p/f200ba4aa420)
[14、jvm支持数组](https://www.jianshu.com/p/11ac0e3a92b3)
[15、jvm支持字符串-数组扩展](https://www.jianshu.com/p/d27ab1534f52)
[16、本地方法调用](https://www.jianshu.com/p/8dd487605bf4)
[17、ClassLoader原理](https://www.jianshu.com/p/defba0b8941d)
[18、异常处理](https://www.jianshu.com/p/4b915f356a61)
[19、 启动jvm](https://www.jianshu.com/p/21a65fbba2e7)
####ClassLoader原理
class 与 object互相引用，可以让class找到实例，实例找到对应class
```
type Class struct {
	jClass            *Object		// java.lang.Class实例
}

// 表示实例
type Object struct {
	extra interface{}  //todo native 记录额外信息 class
}
```

####classLoader原理
* 1 、先加载"java/lang/Class"
* 2、加载基本数据类型

```
// 创建一个类加载器
//todo bootstrp ClassLoader启动类加载器   
func NewClassLoader(cp *classpath.Classpath, verboseFlag bool) *ClassLoader {
	loader := &ClassLoader{
		cp:          cp,
		verboseFlag: verboseFlag, //添加测试标志
		classMap:    make(map[string]*Class),
	}

	//先载入java.lang.Class
	loader.loadBasicClasses()
	//加载基本类型
	loader.loadPrimitiveClasses()

	return loader
}
```

先加载class ，构建class与object关系
```
func (self *ClassLoader) loadBasicClasses() {

	//bootstrap loader 先加载 java/lang/Class
	jlClass := self.LoadClass("java/lang/Class")
	//互相引用 class与object ,便于互相查找
	for _, class := range self.classMap {
		if class.jClass == nil {
			class.jClass = jlClass.NewObject() //新建object
			class.jClass.extra = class         // object.extra 指向当前class
		}
	}

}
```
加载基本数据类型
```
//加载基本类型
func (self *ClassLoader) loadPrimitiveClasses() {
	for primitiveType, _ := range primitiveTypes {
		self.loadPrimitiveClass(primitiveType)
	}
}

// void
func (self *ClassLoader) loadPrimitiveClass(className string) {

	class := &Class{
		accessFlags: ACC_PUBLIC,
		name:        className,
		loader:      self,
		initStarted: true,
	}

	class.jClass = self.classMap["java/lang/Class"].NewObject()
	class.jClass.extra = class
	self.classMap[className] = class
}
```

LoadClass
```
// 把类数据加载到方法区
func (self *ClassLoader) LoadClass(name string) *Class {
	if class, ok := self.classMap[name]; ok {
		return class // 类已经加载
	}

	var class *Class

	//数组类型
	if name[0] == '[' {
		class = self.loadArrayClass(name)
	} else {
		class = self.loadNonArrayClass(name)
	}

	//互相引用 class与object
	if jlClass, ok := self.classMap["java/lang/Class"]; ok {
		class.jClass = jlClass.NewObject()
		class.jClass.extra = class
	}

	return class // 普通类的数据来自于class文件，数组类的数据是jvm在运行期间动态生成的
}
```

native/java/lang/Class.go
```
const jlClass = "java/lang/Class"

func init() {
	native.Register(jlClass, "getPrimitiveClass", "(Ljava/lang/String;)Ljava/lang/Class;", getPrimitiveClass)
	native.Register(jlClass, "getName0", "()Ljava/lang/String;", getName0)
	native.Register(jlClass, "desiredAssertionStatus0", "(Ljava/lang/Class;)Z", desiredAssertionStatus0)
	native.Register(jlClass, "isInterface", "()Z", isInterface)
	native.Register(jlClass, "isPrimitive", "()Z", isPrimitive)
}

// static native Class<?> getPrimitiveClass(String name);
// (Ljava/lang/String;)Ljava/lang/Class;
func getPrimitiveClass(frame *rtda.Frame) {
	nameObj := frame.LocalVars().GetRef(0)
	name := heap.GoString(nameObj)

	loader := frame.Method().Class().Loader()
	class := loader.LoadClass(name).JClass()

	frame.OperandStack().PushRef(class)
}

// private native String getName0();
// ()Ljava/lang/String;
func getName0(frame *rtda.Frame) {
	this := frame.LocalVars().GetThis()
	class := this.Extra().(*heap.Class)

	name := class.JavaName()
	nameObj := heap.JString(class.Loader(), name)

	frame.OperandStack().PushRef(nameObj)
}

// private static native boolean desiredAssertionStatus0(Class<?> clazz);
// (Ljava/lang/Class;)Z
func desiredAssertionStatus0(frame *rtda.Frame) {
	// todo
	frame.OperandStack().PushBoolean(false)
}

// public native boolean isInterface();
// ()Z
func isInterface(frame *rtda.Frame) {
	vars := frame.LocalVars()
	this := vars.GetThis()
	class := this.Extra().(*heap.Class)

	stack := frame.OperandStack()
	stack.PushBoolean(class.IsInterface())
}

// public native boolean isPrimitive();
// ()Z
func isPrimitive(frame *rtda.Frame) {
	vars := frame.LocalVars()
	this := vars.GetThis()
	class := this.Extra().(*heap.Class)

	stack := frame.OperandStack()
	stack.PushBoolean(class.IsPrimitive())
}

```


class文件加载顺序
```shell
+ go run main -verbose:class -cp test/lib/example.jar jvmgo.book.ch09.TestLoadClass
[loadNonArrayClass Loaded java/lang/Object from /Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home/jre/lib/rt.jar]
[loadNonArrayClass Loaded java/io/Serializable from /Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home/jre/lib/rt.jar]
[loadNonArrayClass Loaded java/lang/reflect/AnnotatedElement from /Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home/jre/lib/rt.jar]
[loadNonArrayClass Loaded java/lang/reflect/GenericDeclaration from /Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home/jre/lib/rt.jar]
[loadNonArrayClass Loaded java/lang/reflect/Type from /Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home/jre/lib/rt.jar]
[loadNonArrayClass Loaded java/lang/Class from /Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home/jre/lib/rt.jar]
[loadNonArrayClass Loaded jvmgo/book/ch09/TestLoadClass from /Users/chentong/github/jvmgo/go/test/lib/example.jar]
[loadNonArrayClass Loaded java/lang/Comparable from /Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home/jre/lib/rt.jar]
[loadNonArrayClass Loaded java/lang/CharSequence from /Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home/jre/lib/rt.jar]
[loadNonArrayClass Loaded java/lang/String from /Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home/jre/lib/rt.jar]
[loadNonArrayClass Loaded java/lang/Cloneable from /Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home/jre/lib/rt.jar]
+ echo OK
OK
```

#### 实战项目地址
https://github.com/yinlingchaoliu/jvmgo.git

提交标签 "native"
