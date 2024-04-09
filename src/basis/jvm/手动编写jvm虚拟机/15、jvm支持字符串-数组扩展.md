---
title: 15、jvm支持字符串-数组扩展
date: 2024-04-10 06:06:06
category:
  - 手动编写jvm虚拟机
tag:
  - jvmgo
---

### 采用hook方式生成字符串
1. 加载java/lang/String => jstr
2. ClassLoader加载'[C'  char数组
3. 将go 字符串utf-8  转换为 java utf-16格式
4. 反射修改string value字段

```go
// go string -> java.lang.String
func JString(loader *ClassLoader, goStr string) *Object {
	if internedStr, ok := internedStrings[goStr]; ok {
		return internedStr
	}

	//go 字符串 utf-8 => java utf-16
	chars := stringToUtf16(goStr)

	//加载 java类 char数组
	jChars := &Object{loader.LoadClass("[C"), chars}

	//加载java类 String
	jStr := loader.LoadClass("java/lang/String").NewObject()

	//反射设置
	jStr.SetRefVar("value", "[C", jChars)

	internedStrings[goStr] = jStr
	return jStr
}
```

反射支持
```go
object.go

func (self *Object) GetRefVar(name, descriptor string) *Object {
	field := self.class.getField(name, descriptor, false)
	slots := self.data.(Slots)
	return slots.GetRef(field.slotId)
}

func (self *Object) SetRefVar(name, descriptor string, ref *Object) {
	field := self.class.getField(name, descriptor, false)
	slots := self.data.(Slots)
	slots.SetRef(field.slotId, ref)
}

class.go
func (self *Class) getField(name, descriptor string, isStatic bool) *Field {
	for c := self; c != nil; c = c.superClass {
		for _, field := range c.fields {
			if field.IsStatic() == isStatic &&
				field.name == name &&
				field.descriptor == descriptor {

				return field
			}
		}
	}
	return nil
}

// todo 支持反射 reflection
func (self *Class) GetRefVar(fieldName, fieldDescriptor string) *Object {
	field := self.getField(fieldName, fieldDescriptor, true)
	return self.staticVars.GetRef(field.slotId)
}

func (self *Class) SetRefVar(fieldName, fieldDescriptor string, ref *Object) {
	field := self.getField(fieldName, fieldDescriptor, true)
	self.staticVars.SetRef(field.slotId, ref)
}

```

idc扩展
```go
//todo 特别支持
	case string:  //todo 支持字符串 压栈
		internedStr := heap.JString(class.Loader(),c.(string))
		stack.PushRef(internedStr)

```

classloader扩展
```go
func initStaticFinalVar(){

case "Ljava/lang/String;": //todo 支持字符串
			goStr := cp.GetConstant(cpIndex).(string)
			jStr := JString(class.Loader(),goStr)
			vars.SetRef(slotId,jStr)
		}
}
```

### 字符串测试

```go

func Interpret(){
	//字符串参数
	jArgs := createArgsArray(method.Class().Loader(),args)
	frame.LocalVars().SetRef(0,jArgs)
}

//创建args数组
func createArgsArray(loader *heap.ClassLoader, args []string) *heap.Object {
	//加载class类
	stringClass := loader.LoadClass("java/lang/String")
	argsArr := stringClass.ArrayClass().NewArray(uint(len(args)))
	jArgs := argsArr.Refs()
	for i, arg := range args {
		jArgs[i] = heap.JString(loader, arg)
	}
	return argsArr
}
```

### shell脚本
```bash
#测试字符串数组
go run main   -test "string"  -cp test/lib/example.jar   jvmgo.book.ch01.HelloWorld
#测试字符串参数
go run main   -test "string"  -cp test/lib/example.jar   jvmgo.book.ch08.PrintArgs  'go jvm args' 'PrintArgs' 'Hello , World'
```

### 实战项目地址
https://gitee.com/yinlingchaoliu/jvmgo.git

提交标签 "array"
