---
title: 4、添加testOption-便于单元测试
date: 2024-04-10 06:06:06
category:
  - 手动编写jvm虚拟机
tag:
  - jvmgo
---

### 原因
自己手动写java虚拟机源码，属于章回式讲课。

实际项目，要减少冗余重复代码，让接手的人易于理解

也要有单元测试类，便于项目重构

因此添加testOption

### 测试参数
增加 -test
```go
type Cmd struct {
	testOption  string  // 指定测试方法
}

func parseCmd() *Cmd {
	//增加测试方法
	flag.StringVar(&cmd.testOption, "test", "", "test")
}
```

main函数调用

根据cmd.testOption内容判断调用测试方法
```go
func main() {
	cmd := parseCmd()

	if cmd.versionFlag {
		fmt.Println("version 0.0.1")
	} else if cmd.helpFlag || cmd.class == "" {
		printUsage()
	} else if cmd.testOption == "cmd" {
		parseCmdLine(cmd)
	} else if cmd.testOption == "classpath" {
		parseClasspath(cmd)
	} else {
		startJvm(cmd)
	}

}
```

测试shell脚本
```bash
#!/bin/sh
set -ex

cd ./go
export GOPATH=$PWD
#main 编译目录
go run main -version
//测试 命令行功能
go run main -test "cmd" 12 344 567
//测试类查找功能
go run main -test "classpath" java.lang.Object
```

### 实战项目地址
https://gitee.com/yinlingchaoliu/jvmgo.git
