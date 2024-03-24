---
title: 5、解析classfile文件
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
class文件有严格规范，保障了“编写一次，四处运行”，但是加载class文件来源，给予足够自由
javap工具 可以反编译class文件，对应图形化工具classpy

go语言 函数名大写外部可以访问，小写不可以访问

####classFile结构体
```
jvm规范
/*
ClassFile {
    u4             magic;
    u2             minor_version;
    u2             major_version;
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;
    u2             this_class;
    u2             super_class;
    u2             interfaces_count;
    u2             interfaces[interfaces_count];
    u2             fields_count;
    field_info     fields[fields_count];
    u2             methods_count;
    method_info    methods[methods_count];
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
*/

type ClassFile struct {
	magic        uint32          // 魔数
	minorVersion uint16          // 次版本号
	majorVersion uint16          // 主版本号
	constantPool ConstantPool    // 常量池
	accessFlags  uint16          // 类访问标志
	thisClass    uint16          // 类常量池索引
	superClass   uint16          // 父类常量池索引（只有Object为0）
	interfaces   []uint16        // 接口常量池索引表
	fields       []*MemberInfo   // 字段表
	methods      []*MemberInfo   // 方法表
	attributes   []AttributeInfo // 属性表
}
```

* 1、魔数
文件格式必须以某个固定字节开头
class文件 0xCAFEBABE
PDF文件  %PDF
ZIP文件  PK
```
func (self *ClassFile) readAndCheckMagic(reader *ClassReader) {
	magic := reader.readUint32() // 读取魔数
	if magic != 0xCAFEBABE { // 检查魔数
		panic("java.lang.ClassFormatError: magic!")
	}
}
```

* 2、版本号

| java版本      | class版本号      |
|-------------|---------------|
| JDK1.0.2    | 45.0~45.3     |
| JDK1.1      | 45.0~45.65535 |
| J2SE1.2     | 46.0          |
| J2SE1.3     | 47.0          |
| J2SE1.4     | 48.0          |
| JAVA SE 5.0 | 49.0          |
| JAVA SE 6   | 50.0          |
| JAVA SE 7   | 51.0          |
| JAVA SE 8   | 52.0          |

说明1.2之前采用主次版本号，从1.2之后，次版本号为0
jdk8 支持检测
```
// 读取并检查主次版本号
func (self *ClassFile) readAndCheckVersion(reader *ClassReader) {
	self.minorVersion = reader.readUint16() // 次版本号
	self.majorVersion = reader.readUint16() // 主版本号
	switch self.majorVersion {
	case 45: // jdk1.0 ~ jdk1.1，次版本号不为0
		return
	case 46, 47, 48, 49, 50, 51, 52, 53, 54: // jdk1.2 ~ jdk10，此版本号都为0
		if self.minorVersion == 0 {
			return
		}
	}
	panic("java.lang.UnsupportedClassVersionError!")
}
```

3、字段和方法表
```
type MemberInfo struct {
	accessFlags     uint16 // 字段或方法的访问标志
	nameIndex       uint16 // 字段名或方法名的常量池索引
	descriptorIndex uint16 // 字段或方法的描述符常量池索引
	attributes      []AttributeInfo

	cp ConstantPool
}

//属性
type AttributeInfo interface {
	readInfo(reader *ClassReader)
}
```
4、解析classfile

![classfile](https://upload-images.jianshu.io/upload_images/5526061-a7196bdce6292b03.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



####从byte数组树化ClassFile
```
// 将 []byte 转换成 ClassFile
func Parse(classData []byte) (cf *ClassFile, err error) {
	cr := &ClassReader{classData}
	cf = &ClassFile{}
	cf.read(cr)
	return
}

// 使用 ClassReader 从 ClassReader 中读取内容，赋值给 ClassFile 的各个属性
func (self *ClassFile) read(reader *ClassReader) {
	self.readAndCheckMagic(reader)
	self.readAndCheckVersion(reader)
	self.constantPool = readConstantPool(reader)
	self.accessFlags = reader.readUint16()
	self.thisClass = reader.readUint16()
	self.superClass = reader.readUint16()
	self.interfaces = reader.readUint16s()
	self.fields = readMembers(reader, self.constantPool)
	self.methods = readMembers(reader, self.constantPool)
	self.attributes = readAttributes(reader, self.constantPool)
}
```

####实战项目地址
https://github.com/yinlingchaoliu/jvmgo.git
提交标签classfile
