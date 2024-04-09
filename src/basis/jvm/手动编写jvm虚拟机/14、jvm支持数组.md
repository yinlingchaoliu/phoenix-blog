---
title: 14、jvm支持数组
date: 2024-04-10 06:06:06
category:
  - 手动编写jvm虚拟机
tag:
  - jvmgo
---

### 知识扩展
* 基本型数组  一维数组
* 引用型数组  多维数组

| 数组类                | 普通类                 |
|--------------------|---------------------|
| java虚拟机运行时生成       | class文件加载           |
| newarray/anewarray | new创建               |
| 存放aload/astore     | 存放putfield/getfield |
                 

arraylength读取长度    
* ([)+数组元素类型描述符   eg:

* int[] -> [I 
* int[][] ->[[I
* Object -> [Ljava/lang/Object;

### 关键函数
```go
type Object struct{
  class *Class
  data  interface{}  //void *
}

// 新创建的实例对象需要赋初值，go默认赋了
func newObject(class *Class) *Object {
	return &Object{
		class:  class,
		data: newSlots(class.instanceSlotCount),
	}
}
```

以int数组为例
```go
array_object.go

func (self *Object) Ints() []int32 {
	return self.data.([]int32)
}

//arraylength
func (self *Object) ArrayLength() int32 {
	switch self.data.(type) {
	case []int32:
		return int32(len(self.data.([]int32)))
	default:
		panic("Not array!")
	}
}

array_class.go

func (self *Class) NewArray(count uint) *Object {
	if !self.IsArray() {
		panic("Not array class: " + self.name)
	}
	switch self.Name() {
	case "[I": //int
		return &Object{self, make([]int32, count)}
	default:
		return &Object{self, make([]*Object, count)}
	}
}
```

类加载器支持数组
```go
class_loader.go

// 把类数据加载到方法区
func (self *ClassLoader) LoadClass(name string) *Class {
	if class, ok := self.classMap[name]; ok {
		return class // 类已经加载
	}

	//数组类型
	if name[0] == '['{
		return self.loadArrayClass(name)
	}

	//非数组类型
	return self.loadNonArrayClass(name) // 普通类的数据来自于class文件，数组类的数据是jvm在运行期间动态生成的
}

func (self *ClassLoader) loadArrayClass(name string) *Class {
	class := &Class{
		accessFlags: ACC_PUBLIC, // todo
		name:        name,
		loader:      self,
		initStarted: true,
		superClass:  self.LoadClass("java/lang/Object"),
		interfaces: []*Class{
			self.LoadClass("java/lang/Cloneable"),
			self.LoadClass("java/io/Serializable"),
		},
	}
	self.classMap[name] = class
	return class
}

```

newarray指令
```go
func (self *NEW_ARRAY) Execute(frame *rtda.Frame) {
	stack := frame.OperandStack()
	count := stack.PopInt()
	if count < 0 {
		panic("java.lang.NegativeArraySizeException")
	}

	classLoader := frame.Method().Class().Loader()
	arrClass := getPrimitiveArrayClass(classLoader, self.atype)
	arr := arrClass.NewArray(uint(count))
	stack.PushRef(arr)
}

func getPrimitiveArrayClass(loader *heap.ClassLoader, atype uint8) *heap.Class {
	switch atype {
	case AT_BOOLEAN:
		return loader.LoadClass("[Z")
	case AT_BYTE:
		return loader.LoadClass("[B")
	case AT_CHAR:
		return loader.LoadClass("[C")
	case AT_SHORT:
		return loader.LoadClass("[S")
	case AT_INT:
		return loader.LoadClass("[I")
	case AT_LONG:
		return loader.LoadClass("[J")
	case AT_FLOAT:
		return loader.LoadClass("[F")
	case AT_DOUBLE:
		return loader.LoadClass("[D")
	default:
		panic("Invalid atype!")
	}
}
```

符号表转换
class_name_helper.go
```go

var primitiveTypes = map[string]string{
	"void":    "V",
	"boolean": "Z",
	"byte":    "B",
	"short":   "S",
	"int":     "I",
	"long":    "J",
	"char":    "C",
	"float":   "F",
	"double":  "D",
}

// [XXX -> [[XXX
// int -> [I
// XXX -> [LXXX;
func getArrayClassName(className string) string {
	return "[" + toDescriptor(className)
}

// [[XXX -> [XXX
// [LXXX; -> XXX
// [I -> int
func getComponentClassName(className string) string {
	if className[0] == '[' {
		componentTypeDescriptor := className[1:]
		return toClassName(componentTypeDescriptor)
	}
	panic("Not array: " + className)
}

// [XXX => [XXX
// int  => I
// XXX  => LXXX;
func toDescriptor(className string) string {
	if className[0] == '[' {
		// array
		return className
	}
	if d, ok := primitiveTypes[className]; ok {
		// primitive
		return d
	}
	// object
	return "L" + className + ";"
}

// [XXX  => [XXX
// LXXX; => XXX
// I     => int
func toClassName(descriptor string) string {
	if descriptor[0] == '[' {
		// array
		return descriptor
	}
	if descriptor[0] == 'L' {
		// object
		return descriptor[1 : len(descriptor)-1]
	}
	for className, d := range primitiveTypes {
		if d == descriptor {
			// primitive
			return className
		}
	}
	panic("Invalid descriptor: " + descriptor)
}
```

aload/astore指令
```go
func (self *AALOAD) Execute(frame *rtda.Frame) {
	stack := frame.OperandStack()
	index := stack.PopInt()
	arrRef := stack.PopRef()

	checkNotNil(arrRef)
	refs := arrRef.Refs()
	checkIndex(len(refs), index)
	stack.PushRef(refs[index])
}

func (self *AASTORE) Execute(frame *rtda.Frame) {
	stack := frame.OperandStack()
	ref := stack.PopRef()
	index := stack.PopInt()
	arrRef := stack.PopRef()

	checkNotNil(arrRef)
	refs := arrRef.Refs()
	checkIndex(len(refs), index)
	refs[index] = ref
}
```

### 测试数组
```bash
go run main -verbose:class -verbose:inst  -test "array"  -cp test/lib/example.jar   jvmgo.book.ch08.BubbleSortTest
```

### 实战项目地址
https://gitee.com/yinlingchaoliu/jvmgo.git
