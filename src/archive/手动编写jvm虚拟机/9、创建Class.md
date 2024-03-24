---
title: 9、创建Class
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
####知识扩展
方法区存储类信息

创建Class
1、存储类信息
2、常量池转化为运行时常量池

####1、从classFile读取信息，拷贝到类中

Class 
```
type Class struct {
	accessFlags       uint16        // 类访问标志
	name              string        // 类名（全限定）
	superClassName    string        // 父类名（全限定），eg. java/lang/Object
	interfaceNames    []string      // 接口名（全限定）
	constantPool      *ConstantPool // 运行时常量池
	fields            []*Field      // 字段表
	methods           []*Method     // 方法表
	loader            *ClassLoader  // 类加载器
	superClass        *Class        // 父类指针
	interfaces        []*Class      // 实现的接口指针
	instanceSlotCount uint          // 存放实例变量占据的空间大小（包含从父类继承来的实例变量）（其中long和double占两个slot）
	staticSlotCount   uint          // 存放类变量占据的空间大小（只包含当前类的类变量）（其中long和double占两个slot）
	staticVars        Slots         // 存放静态变量
	initStarted       bool
}
```

1、创建class实例总方法
```
func newClass(cf *classfile.ClassFile) *Class {
	class := &Class{}
	class.accessFlags = cf.AccessFlags()
	class.name = cf.ClassName()
	class.superClassName = cf.SuperClassName()
	class.interfaceNames = cf.InterfaceNames()
	class.constantPool = newConstantPool(class, cf.ConstantPool())
	class.fields = newFields(class, cf.Fields())
	class.methods = newMethods(class, cf.Methods())
	return class
}
```

公共字段信息 (访问标志，访问名字，描述符)
```
// Field 与 Method 的父类，不是 Class 的父类
type ClassMember struct {
	accessFlags uint16
	name        string
	descriptor  string
	class       *Class // 所属的类
}

// 从 classFile 中复制数据
func (self *ClassMember) copyMemberInfo(memberInfo *classfile.MemberInfo) {
	self.accessFlags = memberInfo.AccessFlags()
	self.name = memberInfo.Name()
	self.descriptor = memberInfo.Descriptor()
}

// d 是否可以访问 self(字段或方法)
func (self *ClassMember) isAccessibleTo(d *Class) bool {
	// self 是 public
	if self.IsPublic() {
		return true
	}
	c := self.class
	// self 是 protected，则只有 d 是 self所在的class c的子类或者同一个包可以访问
	// 注意 protected 不只是子类级别，同包也可访问
	if self.IsProtected() {
		return d == c || d.isSubClassOf(c) || c.getPackageName() == d.getPackageName()
	}
	// self 是 default 级别
	if !self.IsPrivate() {
		return c.getPackageName() == d.getPackageName()
	}
	return d == c
}
```

根据 classFile 创建 字段表
```
type Field struct {
	ClassMember
	constantValueIndex uint
	slotId             uint
}

// 根据 classFile 创建 字段表
func newFields(class *Class, cfFields []*classfile.MemberInfo) []*Field {
	fields := make([]*Field, len(cfFields))
	for i, cfField := range cfFields {
		fields[i] = &Field{}
		fields[i].class = class
		fields[i].copyMemberInfo(cfField)
		fields[i].copyAttributes(cfField)
	}
	return fields
}
```


根据 classFile 创建 方法表
```
type Method struct {
	ClassMember
	maxStack  uint
	maxLocals uint
	code      []byte // 方法字节码表
	argSlotCount uint // 参数个数
}

func newMethods(class *Class, cfMethods []*classfile.MemberInfo) []*Method {
	methods := make([]*Method, len(cfMethods))
	for i, cfMethod := range cfMethods {
		methods[i] = &Method{}
		methods[i].class = class
		methods[i].copyMemberInfo(cfMethod)
		methods[i].copyAttributes(cfMethod)
		methods[i].calArgSlotCount()
	}
	return methods
}
```

 #### 2、把 classFile 中的常量池转化为运行时常量池
将[]classfile.ConstantInfo 转化为[]heap.Constant
取值通过常量池来获得

```
// 常量项
type Constant interface{}

// 运行时常量池
type ConstantPool struct {
	class  *Class // 所属的类
	consts []Constant
}

//创建运行时常量池 []consts
func newConstantPool(class *Class, cfCp classfile.ConstantPool) *ConstantPool {
	cpCount := len(cfCp)
	consts := make([]Constant, cpCount)
	rtCp := &ConstantPool{class, consts}

	for i := 1; i < cpCount; i++ {
		cpInfo := cfCp[i]
		switch cpInfo.(type) {
		// 字面量：整数、浮点数、字符串
		case *classfile.ConstantIntegerInfo:
			consts[i] = cpInfo.(*classfile.ConstantIntegerInfo).Value()
		case *classfile.ConstantFloatInfo:
			consts[i] = cpInfo.(*classfile.ConstantFloatInfo).Value()
		case *classfile.ConstantLongInfo:
			consts[i] = cpInfo.(*classfile.ConstantLongInfo).Value()
			i++
		case *classfile.ConstantDoubleInfo:
			consts[i] = cpInfo.(*classfile.ConstantDoubleInfo).Value()
			i++
		case *classfile.ConstantStringInfo:
			consts[i] = cpInfo.(*classfile.ConstantStringInfo).String()
			// 符号引用：类、字段、方法、接口方法
		case *classfile.ConstantClassInfo:
			classInfo := cpInfo.(*classfile.ConstantClassInfo)
			consts[i] = newClassRef(rtCp, classInfo)
		case *classfile.ConstantFieldrefInfo:
			fieldrefInfo := cpInfo.(*classfile.ConstantFieldrefInfo)
			consts[i] = newFieldRef(rtCp, fieldrefInfo)
		case *classfile.ConstantMethodrefInfo:
			methodrefInfo := cpInfo.(*classfile.ConstantMethodrefInfo)
			consts[i] = newMethodRef(rtCp, methodrefInfo)
		case *classfile.ConstantInterfaceMethodrefInfo:
			interfaceMethodrefInfo := cpInfo.(*classfile.ConstantInterfaceMethodrefInfo)
			consts[i] = newInterfaceMethodRef(rtCp, interfaceMethodrefInfo)
		}
	}
	return rtCp
}


// 根据索引返回常量项 取值
func (self *ConstantPool) GetConstant(index uint) Constant {
	if c := self.consts[index]; c != nil {
		return c
	}
	panic(fmt.Sprintf("No Constant at index %d", index))
}
```
类、字段、方法、接口存引用
字符串 存常量池索引

引用类
```
// 符号引用基类
type SymRef struct {
	cp        *ConstantPool // 符号引用所在的常量池
	className string        // 类的全限定名
	class     *Class        // 符号引用所属的类
}

func (self *SymRef) ResolvedClass() *Class {
	if self.class == nil {
		self.resolveClassRef()
	}
	return self.class
}

func (self *SymRef) resolveClassRef() {
	d := self.cp.class
	c := d.loader.LoadClass(self.className)
	if !c.isAccessibleTo(d) {
		panic("java.lang.IllegalAccessError")
	}
	self.class = c
}



// 类符号引用
type ClassRef struct {
	SymRef
}

// 将 classfile.ConstantClassInfo 转化为 ClassRef
func newClassRef(cp *ConstantPool, classInfo *classfile.ConstantClassInfo) *ClassRef {
	ref := &ClassRef{}
	ref.cp = cp
	ref.className = classInfo.Name()
	return ref
}

```

```
type MemberRef struct {
	SymRef
	name       string
	descriptor string
}

func (self *MemberRef) copyMemberRefInfo(refInfo *classfile.ConstantMemberrefInfo) {
	self.className = refInfo.ClassName()
	self.name, self.descriptor = refInfo.NameAndDescriptor()
}

// getter
func (self *MemberRef) Name() string {
	return self.name
}
func (self *MemberRef) Descriptor() string {
	return self.descriptor
}
```

#### 实战项目地址
https://github.com/yinlingchaoliu/jvmgo.git
