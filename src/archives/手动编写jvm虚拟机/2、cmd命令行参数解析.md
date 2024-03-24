---
title: 2、cmd命令行参数解析
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
####执行文件 入参解析
cmd.go
```cmd.go
package main

import "flag"
import "fmt"
import "os"

// java [-options] class [args...]
type Cmd struct {
	helpFlag    bool   //java -help
	versionFlag bool   //java -version
	cpOption    string
	class       string // 执行主类
	args        []string // 附加参数
}

//将flag参数转成cmd
func parseCmd() *Cmd {
	cmd := &Cmd{}

	flag.Usage = printUsage
	flag.BoolVar(&cmd.helpFlag, "help", false, "print help message")
	flag.BoolVar(&cmd.helpFlag, "?", false, "print help message")
	flag.BoolVar(&cmd.versionFlag, "version", false, "print version and exit")
	flag.StringVar(&cmd.cpOption, "classpath", "", "classpath")
	flag.StringVar(&cmd.cpOption, "cp", "", "classpath")
	//parse失败 会执行 printUsage
	flag.Parse()

	//解析剩余参数
	args := flag.Args()
	if len(args) > 0 {
		cmd.class = args[0]
		cmd.args = args[1:]
	}

	return cmd
}

//使用范例
func printUsage() {
	fmt.Printf("Usage: %s [-options] class [args...]
", os.Args[0])
}
```

####测试类
main.go
```
package main
import "fmt"

func main() {
	cmd := parseCmd()

	if cmd.versionFlag {
		fmt.Println("version 0.0.1")
	} else if cmd.helpFlag || cmd.class == "" {
		printUsage()
	} else {
		startJVM(cmd)
	}
}

func startJVM(cmd *Cmd) {
	fmt.Printf("classpath:%s class:%s args:%v
",
		cmd.cpOption, cmd.class, cmd.args)
}
```

测试命令 run.sh
```sh
#!/bin/sh
set -ex
export GOPATH=$PWD
go run . -version | grep -q "version 0.0.1"
```

go命令
```
go install 编译
go run 运行
```

####实战项目地址
https://github.com/yinlingchaoliu/jvmgo.git
提交标签 "cmd"
