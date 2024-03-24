---
title: 19、-启动jvm
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
####1、System类初始化
1、System类初始化方法
2、VM调用 System.initializeSystemClass()

```
1、System{
    static{
      registerNatives()
    }
}

2、VM.initialize(){
        System.initializeSystemClass()
}
```

####2、Ending 小遗憾
未能真实实现system类加载，依然用hack方式打印输出信息
笔者水平有限，对虚拟机理解更深刻时，再完整实现

####3、JVM类封装
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

```
//启动jvm
func startJvm(cmd *Cmd) {
	newJVM(cmd).start()
}
```

打印hello world

```
go run main   -cp test/lib/example.jar   jvmgo.book.ch01.HelloWorld
```

#### 实战项目地址
https://github.com/yinlingchaoliu/jvmgo.git

提交标签 "jvm"
