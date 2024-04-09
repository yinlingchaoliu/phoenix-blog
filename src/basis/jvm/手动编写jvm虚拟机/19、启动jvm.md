---
title: 19、启动jvm
date: 2024-04-10 06:06:06
category:
  - 手动编写jvm虚拟机
tag:
  - jvmgo
---

### 1、System类初始化
* 1、System类初始化方法
* 2、VM调用 System.initializeSystemClass()

```go
System{
    static{
      registerNatives()
    }
}

VM.initialize(){
        System.initializeSystemClass()
}
```

### 2、Ending 小遗憾
* 未能真实实现system类加载，依然用hack方式打印输出信息
* 笔者水平有限，对虚拟机理解更深刻时，再完整实现

### 3、JVM类封装
```go
//定义jvm
type JVM struct {
	cmd         *Cmd              //命令行
	classLoader *heap.ClassLoader //类加载器
	mainThread  *rtda.Thread      //主线程
}

//新建虚拟机
func newJVM(cmd *Cmd) *JVM {
	cp := classpath.Parse(cmd.XjreOption, cmd.cpOption)
	classLoader := heap.NewClassLoader(cp, cmd.verboseClassFlag)
	return &JVM{
		cmd:         cmd,
		classLoader: classLoader,
		mainThread:  rtda.NewTread(),
	}
}

//启动虚拟机
func (self *JVM) start() {
	//暂时未能真正启动VM
	//self.initJVM()
	self.execMain()
}

//初始化虚拟机
func (self *JVM) initJVM() {
	vmClass := self.classLoader.LoadClass("sun/misc/VM")
	base.InitClass(self.mainThread, vmClass)
	interpret(self.mainThread, self.cmd.verboseInstFlag)
}

//运行main主方法
func (self *JVM) execMain() {

	//获得加载类名字
	className := strings.Replace(self.cmd.class, ".", "/", -1)
	mainClass := self.classLoader.LoadClass(className)
	//获得main方法
	mainMethod := mainClass.GetMainMethod()

	if mainMethod == nil {
		//增加命令行参数
		fmt.Printf("Main method not found in class %s
", self.cmd.class)
		return
	}

	frame := self.mainThread.NewFrame(mainMethod) //创建栈帧

	//字符串参数
	jArgs := self.createArgsArray()
	frame.LocalVars().SetRef(0, jArgs)
	self.mainThread.PushFrame(frame)              //将栈帧push线程stack中

	interpret(self.mainThread,self.cmd.verboseInstFlag)
}

//创建args数组
func (self *JVM)createArgsArray() *heap.Object {
	//加载class类
	stringClass := self.classLoader.LoadClass("java/lang/String")
	argsArr := stringClass.ArrayClass().NewArray(uint(len(self.cmd.args)))
	jArgs := argsArr.Refs()
	for i, arg := range self.cmd.args {
		jArgs[i] = heap.JString(self.classLoader, arg)
	}
	return argsArr
}
```

启动jvm

```go
//启动jvm
func startJvm(cmd *Cmd) {
	newJVM(cmd).start()
}
```

打印hello world

```bash
go run main   -cp test/lib/example.jar   jvmgo.book.ch01.HelloWorld
```

### 实战项目地址
https://gitee.com/yinlingchaoliu/jvmgo.git

提交标签 "jvm"