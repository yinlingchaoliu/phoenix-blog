---
title: 11、对象实例化new-object
date: 2024-04-10 06:06:06
category:
  - 手动编写jvm虚拟机
tag:
  - jvmgo
---

创建对象需要关键指令

| 指令                   | 作用           |
|----------------------|--------------|
| idc                  | 常量池常量推到操作数栈顶 |
| new                  | 新建实例         |
| putfield/getfield    | 存取实例变量       |
| putstatic/getstatic  | 存取静态变量       |
| Instanceof/checkcast | 判断对象是否属于某类型  |

```go
public class MyObject {

    public static int staticVar;
    public int instanceVar;

    public static void main(String[] args) {
        int x = 32768; // ldc
        MyObject myObj = new MyObject(); // new
        MyObject.staticVar = x; // putstatic
        x = MyObject.staticVar; // getstatic
        myObj.instanceVar = x; // putfield
        x = myObj.instanceVar; // getfield
        Object obj = myObj;
        if (obj instanceof MyObject) { // instanceof
            myObj = (MyObject) obj; // checkcast
            System.out.println(myObj.instanceVar);
        }
    }

}
```

### 关键指令编写

new
```go
func (self *NEW) Execute(frame *rtda.Frame) {
	cp := frame.Method().Class().ConstantPool()            // 1. 获取当前栈帧所在类的常量池
	classRef := cp.GetConstant(self.Index).(*heap.ClassRef) // 2. 获取类符号引用
	class := classRef.ResolvedClass()                      // 3. 根据类符号引用创建类
	if !class.InitStarted() {
		frame.RevertNextPC()
		base.InitClass(frame.Thread(), class)
		return
	}

	if class.IsInterface() || class.IsAbstract() {
		panic("java.lang.InstantiationError")
	}

	ref := class.NewObject()          // 4. 创建对象
	frame.OperandStack().PushRef(ref) // 5. 将引用对象push到栈顶
}
```

getstatic

```go
func (self *GET_STATIC) Execute(frame *rtda.Frame) {
	cp := frame.Method().Class().ConstantPool()
	// 1. 获取字段符号引用
	fieldRef := cp.GetConstant(self.Index).(*heap.FieldRef)
	// 2. 将字段符号引用解析为Field
	field := fieldRef.ResolvedField()
	class := field.Class()

	if !class.InitStarted() {
		frame.RevertNextPC()
		base.InitClass(frame.Thread(), class)
		return
	}

	// 不是静态变量
	if !field.IsStatic() {
		panic("java.lang.IncompatibleClassChangeError")
	}

	stack := frame.OperandStack()
	slots := class.StaticVars()
	// 3. 从Field的静态变量列表中获取值，push到操作数栈
	switch field.Descriptor()[0] {
	case 'Z', 'B', 'C', 'S', 'I':
		stack.PushInt(slots.GetInt(field.SlotId()))
	case 'F':
		stack.PushFloat(slots.GetFloat(field.SlotId()))
	case 'J':
		stack.PushLong(slots.GetLong(field.SlotId()))
	case 'D':
		stack.PushDouble(slots.GetDouble(field.SlotId()))
	case 'L', '[': // 对象或数组
		stack.PushRef(slots.GetRef(field.SlotId()))
	}
}
```

getfield

```go
func (self *GET_FIELD) Execute(frame *rtda.Frame) {
	cp := frame.Method().Class().ConstantPool()
	// 1. 获取字段符号引用
	fieldRef := cp.GetConstant(self.Index).(*heap.FieldRef)
	// 2. 将字段符号引用解析为Field
	field := fieldRef.ResolvedField()
	if field.IsStatic() {
		panic("java.lang.IncompatibleClassChangeError")
	}

	stack := frame.OperandStack()
	// 3. 获取对象引用
	ref := stack.PopRef()
	if ref == nil {
		panic("java.lang.NullPointerException")
	}
	slots := ref.Fields()
	// 4. 从对象引用的实例变量列表中获取值，push到操作数栈
	switch field.Descriptor()[0] {
	case 'Z', 'B', 'C', 'S', 'I':
		stack.PushInt(slots.GetInt(field.SlotId()))
	case 'F':
		stack.PushFloat(slots.GetFloat(field.SlotId()))
	case 'J':
		stack.PushLong(slots.GetLong(field.SlotId()))
	case 'D':
		stack.PushDouble(slots.GetDouble(field.SlotId()))
	case 'L', '[': // 对象或数组
		stack.PushRef(slots.GetRef(field.SlotId()))
	}
}
```

checkcast
```go
func (self *CHECK_CAST) Execute(frame *rtda.Frame) {
	// 1. 从操作数栈获取对象引用ref
	stack := frame.OperandStack()
	ref := stack.PopRef()
	stack.PushRef(ref)
	// (Integer)null -> null引用可以转换为任何类型
	if ref == nil {
		return
	}

	cp := frame.Method().Class().ConstantPool()            // 2. 获取当前栈帧所在类的常量池
	classRef := cp.GetConstant(self.Index).(*heap.ClassRef) // 3. 获取类符号引用
	class := classRef.ResolvedClass()                      // 4. 根据类符号引用创建类
	if !ref.IsInstanceOf(class) { // 5. 判断 ref instanceof class
		panic("java.lang.ClassCastException") // 6. 如果不是，抛异常
	}
}
```

instanceof
```go
func (self *INSTANCE_OF) Execute(frame *rtda.Frame) {
	// 1. 从操作数栈获取对象引用ref
	stack := frame.OperandStack()
	ref := stack.PopRef()
	// null instanceof Xxx -> false
	if ref == nil {
		stack.PushInt(0)
		return
	}

	cp := frame.Method().Class().ConstantPool()            // 2. 获取当前栈帧所在类的常量池
	classRef := cp.GetConstant(self.Index).(*heap.ClassRef) // 3. 获取类符号引用
	class := classRef.ResolvedClass()                      // 4. 根据类符号引用创建类
	if ref.IsInstanceOf(class) { // 5. 判断 ref instanceof class
		stack.PushInt(1) // 6. 将结果压入栈
	} else {
		stack.PushInt(0)
	}
}
```
idc指令
```go
func (self *LDC) Execute(frame *rtda.Frame) {
	_ldc(frame, self.Index)
}

func (self *LDC_W) Execute(frame *rtda.Frame) {
	_ldc(frame, self.Index)
}

func (self *LDC2_W) Execute(frame *rtda.Frame) {
	// 1. 从运行时常量池获取常量c
	stack := frame.OperandStack()
	cp := frame.Method().Class().ConstantPool()
	c := cp.GetConstant(self.Index)

	// 2. 将常量c压入操作数栈
	switch c.(type) {
	case int64:
		stack.PushLong(c.(int64))
	case float64:
		stack.PushDouble(c.(float64))
	default:
		panic("java.lang.ClassFormatError")
	}
}

func _ldc(frame *rtda.Frame, index uint) {
	// 1. 从运行时常量池获取常量c
	stack := frame.OperandStack()
	cp := frame.Method().Class().ConstantPool()
	c := cp.GetConstant(index)

	// 2. 将常量c压入操作数栈
	switch c.(type) {
	case int32:
		stack.PushInt(c.(int32))
	case float32:
		stack.PushFloat(c.(float32))
	//case string:
	//case *heap.ClassRef:
	default:
		panic("todo:ldc!")
	}
}
```

### 编写测试类
```go 

//测试classloader
func parseClassLoader(cmd *Cmd) {

	cp := classpath.Parse(cmd.XjreOption, cmd.cpOption)
	//获得classLoader
	classLoader := heap.NewClassLoader(cp)
	//获得加载类名字
	className := strings.Replace(cmd.class, ".", "/", -1)
	mainClass := classLoader.LoadClass(className)
	//获得main方法
	mainMethod := mainClass.GetMainMethod()
	if mainMethod != nil {
		interpret(mainMethod)
	}else{
		fmt.Printf("Main method not found in class %s
",cmd.class)
	}

}
```

### shell脚本
```bash
go run main -test "classloader" -cp test/lib/example.jar jvmgo.book.ch06.MyObject #测试classloader
```

###  实战项目地址
https://gitee.com/yinlingchaoliu/jvmgo.git
