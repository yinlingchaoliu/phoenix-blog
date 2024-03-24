---
title: cmake快速实战
date: 2024-03-24 11:47:50
category:
  - 如何学习ndk
tag:
  - archive
---
####目录
[cmake快速实战](https://www.jianshu.com/p/f33988197f60)

[Android JNI基础知识讲解](https://www.jianshu.com/p/c86dce5a70b0)

[Android JNI实战](https://www.jianshu.com/p/a4022db636d5)

#### makefile前言
我写过makefile，编写过简单makefile框架,
但是cmake比较简单一些。
原理简单
编写输入：环境变量，cpp, c，h文件
编写输出：lib, so, bin (即静态库，动态库，二进制执行文件)

 cmake官网
```
https://cmake.org/cmake/help/latest/guide/tutorial/index.html
```

####常用方法
* set 设置变量
* include_directories 将头文件添加到搜索路径中
* aux_source_directory 当前目录所有源文件保存到指定变量
* add_subdirectory 添加子目录
* add_library 指定要编译的库
* add_executable 生成执行文件
* target_link_libraries 将库链接
* add_test 测试工具

####模板式编写cmake
#####1、创建CMakeLists.txt
* 1、生成执行程序
```
# 指定 CMake 使用版本
cmake_minimum_required(VERSION 3.6)
# 工程名
project(hello)
#设置变量
set(SRC_LIST hello.cpp)
# 编译可执行文件
add_executable(helloBin ${SRC_LIST} )
```

* 2、生成静态库
```
project(hello)
set(LIB_SRC hello.cpp)
add_library(libhello STATIC ${LIB_SRC})
```

标准模板写法
```
# 查找当前目录下的所有源文件
# 并将名称保存到 DIR_LIB_SRCS 变量
aux_source_directory(. DIR_LIB_SRCS)

#当前文件夹名称 便于生成模板代码
STRING( REGEX REPLACE ".*/(.*)" "\1" CURRENT_FOLDER ${CMAKE_CURRENT_SOURCE_DIR} )
set(TARGET ${CURRENT_FOLDER})

# 指定生成 TARGET 静态库
add_library (${TARGET} ${DIR_LIB_SRCS})
```

* 3、生成动态库
```
project(HELLO)
set(LIB_SRC hello.c)
add_library(dllhello SHARED ${LIB_SRC}）
```

#####2、引入cmake环境变量及编译
环境变量
```
#引入环境变量 cmake
vi .bash_profile

#cmake
export PATH=$PATH:/Users/chentong/Android/sdk/cmake/3.6.4111459/bin
wq保存

source .bash_profile //环境变量生效
```

编译 示例在demo1中
```
cmake  CMakeLists.txt  //编译cmake文件
make //编译
```

输出
```
yingzi:demo1 chentong$ cmake CMakeLists.txt 
-- The C compiler identification is AppleClang 11.0.0.11000033
-- The CXX compiler identification is AppleClang 11.0.0.11000033
-- Check for working C compiler: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc
-- Check for working C compiler: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc -- works
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Detecting C compile features
-- Detecting C compile features - done
-- Check for working CXX compiler: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++
-- Check for working CXX compiler: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ -- works
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/chentong/Android/taixin/HowToLearnNdk/demo1

yingzi:demo1 chentong$ make 
Scanning dependencies of target helloBin
[ 50%] Building CXX object CMakeFiles/helloBin.dir/hello.cpp.o
[100%] Linking CXX executable helloBin
[100%] Built target helloBin
```

* cmake 打印
```
message("hello")
message("${PROJECT_SOURCE_DIR}")
```

* cmake option选项开关
cmake -DUSE_HELLO=OFF CMakeLists.txt  用命令来调节
```
# 是否使用自己的 hello 库  --option开关选项
option (USE_HELLO "Use provided hello implementation" ON)
# 是否加入 hello 库
if (USE_HELLO)
  include_directories ("${PROJECT_SOURCE_DIR}/hello")
  add_subdirectory (hello)
  set (HELLO_LIBS hello)
endif (USE_HELLO)
```
* 获取当前文件夹名
作为当前项目TARGET，便于生成模板代码
```
//当前目录完整路径
message(${CMAKE_CURRENT_SOURCE_DIR})
STRING( REGEX REPLACE ".*/(.*)" "\1" CURRENT_FOLDER ${CMAKE_CURRENT_SOURCE_DIR} )
//当前文件
message(${CURRENT_FOLDER})
set(TARGET ${CURRENT_FOLDER})
```

* 安装
默认安装到 /usr/local/下面
命令 make install 
```
install (TARGETS ${TARGET} DESTINATION lib)
install (FILES cmath.h DESTINATION include)
install (TARGETS ${MAIN_BIN} DESTINATION bin)
install (FILES "${PROJECT_BINARY_DIR}/config.h" DESTINATION include)
```

* 测试  推荐定义一个宏，用来简化测试工作
```
#定义二进制文件变量
set (MAIN_BIN mainBin)

# 启用测试
enable_testing()

# 测试程序是否成功运行
#语法 add_test(flag , bin ,arg1,arg2...) eg 1:
add_test (test_demo ${MAIN_BIN} 5 2)

# 测试帮助信息是否可以正常提示
add_test (test_usage ${MAIN_BIN})
set_tests_properties (test_usage PROPERTIES PASS_REGULAR_EXPRESSION "Usage: .* base exponent")

# 测试 5 的平方 为 25
add_test (test_5_2 ${MAIN_BIN} 5 2)
set_tests_properties (test_5_2 PROPERTIES PASS_REGULAR_EXPRESSION "is 25")

# 定义一个宏，用来简化测试工作  测试函数 抽象工作
macro (do_test arg1 arg2 result)
  add_test (do_test_${arg1}_${arg2} ${MAIN_BIN} ${arg1} ${arg2})
  set_tests_properties (do_test_${arg1}_${arg2} PROPERTIES PASS_REGULAR_EXPRESSION ${result})
endmacro (do_test)

# 利用 do_test 宏，测试一系列数据,起到简化效果
do_test (2 10 "is 1024")
do_test (3 3 "is 27")
do_test (8 2 "is 64")
```
文件改动，测试前，必须先make编译 ,再ctest
输出结果
```
yingzi:demo5 chentong$ make test 
Running tests...
Test project /Users/chentong/Android/taixin/HowToLearnNdk/cmake-demo/demo5
    Start 1: test_demo
1/6 Test #1: test_demo ........................   Passed    0.00 sec
    Start 2: test_usage
2/6 Test #2: test_usage .......................   Passed    0.00 sec
    Start 3: test_5_2
3/6 Test #3: test_5_2 .........................   Passed    0.00 sec
    Start 4: do_test_2_10
4/6 Test #4: do_test_2_10 .....................   Passed    0.00 sec
    Start 5: do_test_3_3
5/6 Test #5: do_test_3_3 ......................   Passed    0.00 sec
    Start 6: do_test_8_2
6/6 Test #6: do_test_8_2 ......................   Passed    0.00 sec

100% tests passed, 0 tests failed out of 6

Total Test time (real) =   0.02 sec
```

* 支持gdb
```
set(CMAKE_BUILD_TYPE "Debug")
set(CMAKE_CXX_FLAGS_DEBUG "$ENV{CXXFLAGS} -O0 -Wall -g -ggdb")
set(CMAKE_CXX_FLAGS_RELEASE "$ENV{CXXFLAGS} -O3 -Wall")
```

* 检查系统是否有指定函数
```
# 检查系统是否支持 pow 函数
include (${CMAKE_ROOT}/Modules/CheckFunctionExists.cmake)
check_function_exists (pow HAVE_POW)
```

* 添加版本号
```
set (Demo_VERSION_MAJOR 1)
set (Demo_VERSION_MINOR 0)

# 加入一个配置头文件，用于处理 CMake 对源码的设置
configure_file (
  "${PROJECT_SOURCE_DIR}/config.h.in"
  "${PROJECT_BINARY_DIR}/config.h"
  )
```
config.h.in
```
#define Demo_VERSION_MAJOR @Demo_VERSION_MAJOR@
#define Demo_VERSION_MINOR @Demo_VERSION_MINOR@
```
main.cpp
```
int main(int argc, char *argv[])
{
    printf("%s Version %d.%d
",
            argv[0],
            Demo_VERSION_MAJOR,
            Demo_VERSION_MINOR);
    return 0;
}
```

* cpack 打包

```
# 构建一个 CPack 安装包
include (InstallRequiredSystemLibraries)
# License授权
set (CPACK_RESOURCE_FILE_LICENSE "${CMAKE_CURRENT_SOURCE_DIR}/License.txt")
set (CPACK_PACKAGE_VERSION_MAJOR "${Demo_VERSION_MAJOR}")
set (CPACK_PACKAGE_VERSION_MINOR "${Demo_VERSION_MINOR}")
include (CPack)
```
cpack命令
```
#生成二进制安装包：
cpack -C CPackConfig.cmake
#生成源码安装包
cpack -C CPackSourceConfig.cmake
```

开源代码示例
https://github.com/yinlingchaoliu/HowToLearnNdk


####参考范例
CMake 入门实战
http://www.hahack.com/codes/cmake/
源代码
https://github.com/wzpan/cmake-demo
