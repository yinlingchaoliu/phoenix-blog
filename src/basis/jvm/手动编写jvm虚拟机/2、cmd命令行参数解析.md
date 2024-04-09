---
title: 2、cmd命令行参数解析
date: 2024-04-10 06:06:06
category:
  - 手动编写jvm虚拟机
tag:
  - jvmgo
---

### 执行文件 入参解析

cmd.go

```go
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

### 测试类
main.go

```go
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

```bash
#!/bin/sh
set -ex
export GOPATH=$PWD
go run . -version | grep -q "version 0.0.1"
```

go命令
```bash
go install 编译
go run 运行
```

### 实战项目地址
https://gitee.com/yinlingchaoliu/jvmgo.git

提交标签 "cmd"
