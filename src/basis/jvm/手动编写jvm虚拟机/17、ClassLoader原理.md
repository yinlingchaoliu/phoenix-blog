---
title: 17、ClassLoader原理
date: 2024-04-10 06:06:06
category:
  - 手动编写jvm虚拟机
tag:
  - jvmgo
---

### ClassLoader原理

class 与 object互相引用，可以让class找到实例，实例找到对应class

```go
type Class struct {
	jClass            *Object		// java.lang.Class实例
}

// 表示实例
type Object struct {
	extra interface{}  //todo native 记录额外信息 class
}
```

### classLoader原理
* 1 、先加载"java/lang/Class"
* 2、加载基本数据类型

```go
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
```go
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
```go
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
```go
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
```go
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
```bash
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

### 实战项目地址
https://gitee.com/yinlingchaoliu/jvmgo.git

提交标签 "native"
