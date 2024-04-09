---
title: 3、搜索class文件
date: 2024-04-10 06:06:06
category:
  - 手动编写jvm虚拟机
tag:
  - jvmgo
---

### 1、知识扩展

java jvm根据类路径(class path)来搜索类，加载到内存

| 按照搜索先后顺序                     | 位置          |
|------------------------------|-------------|
| 1、启动类路径(bootstrap classpath) | Jre/lib     |
| 2、扩展类路径(extension classpath) | Jre/lib/ext |
| 3、用户类路径(user classpath)      | 当前目录 .      |

可以通过 -Xbootclasspath 修改启动类路径

参数 -classpath /-cp

go语言不需要显式实现接口

defer 确保异常及时处理

### 2、Cmd添加jre目录
```go
// java [-options] class [args...]
type Cmd struct {
	XjreOption  string   // 指定jre启动类的目录
}

func parseCmd() *Cmd {
	flag.StringVar(&cmd.XjreOption,"Xjre","","path to jre")
}

```

### 3、类加载规则

```go
package classpath

import (
	"os"
	"path/filepath"
)

type Classpath struct {
	bootClasspath Entry //启动类搜索
	extClasspath  Entry //扩展类搜索
	userClasspath Entry //用户类搜索
}

//创建解析器
func Parse(jreOption, cpOption string) *Classpath {
	cp := &Classpath{}
	//解析启动类加载
	cp.parseBootAndExtClasspath(jreOption)
	//解析用户类加载
	cp.parseUserClasspath(cpOption)
	return cp
}

// 读取文件名称为className的class文件
func (self *Classpath) ReadClass(className string) ([]byte, Entry, error) {
	className = className + ".class"
	// 1. 从启动类路径寻找读取 <className>.class 类
	if data, entry, err := self.bootClasspath.readClass(className); err == nil {
		return data, entry, err
	}
	// 2. 从扩展类路径寻找读取 <className>.class 类
	if data, entry, err := self.extClasspath.readClass(className); err == nil {
		return data, entry, err
	}
	// 3. 从用户类路径寻找读取 <className>.class 类
	return self.userClasspath.readClass(className)
}

func (self *Classpath) String() string {
	return self.userClasspath.String()
}

func (self *Classpath) parseBootAndExtClasspath(jreOption string) {
	jreDir := getJreDir(jreOption)
	self.bootClasspath = newWildcardEntry(filepath.Join(jreDir, "lib", "*"))       // jre/lib/*
	self.extClasspath = newWildcardEntry(filepath.Join(jreDir, "lib", "ext", "*")) // jre/lib/ext/*
}

func getJreDir(jreOption string) string {
	// 先读取命令行参数-Xjre，如果存在，直接返回（为了简化，不做错误输入的处理）
	if jreOption != "" {
		return jreOption
	}
	// 如果命令行没有传入-Xjre，使用JAVA_HOME/jre
	if javaHome := os.Getenv("JAVA_HOME"); javaHome != "" {
		return filepath.Join(javaHome, "jre")
	}
	panic("Can't find jre folder")
}

func (self *Classpath) parseUserClasspath(cpOption string) {
	if cpOption == "" {
		cpOption = "."
	}
	self.userClasspath = newEntry(cpOption)
}
```

### 4、类路径查找

* 1、Entry搜索类路径
* 2、DirEntry 搜索目录下类路径
* 3、ZipEntry 搜索zip或jar文件形式类路径
* 4、CompositeEntry 组合类路径
* 5、WildcardEntry 所有通配符下类路径

Entry 类路径查找
```go
package classpath

import "os"
import "strings"

//分隔符 ":"
const pathListSeparator = string(os.PathListSeparator)

//定义接口
type Entry interface {
	// 寻找和读取 class 文件
	// 入参：className - class文件的相对路径，eg. 如果要读取 java.lang.Object 类，则className = java/lang/Object.class
	// 返回值：
	// 1. 读取到的class文件内容的[]byte
	// 2. 最终定位到包含className文件的Entry对象
	// 3. 错误信息error
	readClass(className string) ([]byte, Entry, error)
	//获得className
	string() string
}

//根据参数类型创建不同搜索模式
func newEntry(path string) Entry {

	//读取多个className文件 java -cp path1/classes:path2/classes
	if strings.Contains(path, pathListSeparator) {
		return newCompositeEntry(path)
	}

	// 读取path下所有jar文件的className文件  java -cp path/*
	if strings.HasSuffix(path, "*") {
		return newWildcardEntry(path)
	}

	// 从path/lib1.jar下查找并读取className文件：java -cp path/lib1.jar 或者 java -cp path/lib1.zip
	//读取zip/jar下 className文件 :java -cp path/lib1.jar
	if strings.HasSuffix(path, ".jar") || strings.HasSuffix(path, ".zip") {
		return newZipEntry(path)
	}

	//遍历目录
	return newDirEntry(path)
}
```

测试类
```go

//测试classpath
func parseClasspath(cmd *Cmd) {
	cp := classpath.Parse(cmd.XjreOption, cmd.cpOption)
	fmt.Printf("classpath:%v class:%v args:%v
",
		cp, cmd.class, cmd.args)

	className := strings.Replace(cmd.class, ".", "/", -1)
	classData, _, err := cp.ReadClass(className)
	if err != nil {
		fmt.Printf("Could not find or load main class %s
", cmd.class)
		return
	}

	fmt.Printf("class data:%v
", classData)
}
```

### 实战项目地址
https://gitee.com/yinlingchaoliu/jvmgo.git

提交标签classpath