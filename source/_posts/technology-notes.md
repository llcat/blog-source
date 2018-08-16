---
title: technology_notes
date: 2018-08-05 22:28:54
tags:
  - technology
---

#### 技术备忘录
可能是年龄大了，记忆力越来越不好呢，本着好记性不如烂笔头的原则，将一些可能会用到的一些技术方面的杂项记录下来。

#### C 预处理器
C语言通过预处理提供了一些语言层面的功能，一般来说，从我们的源代码到可执行文件要经过下面几个步骤，预处理 -> [根据以#开头的指令，处理过的源程序代码] -> 编译器 -> [汇编程序] -> 汇编器 -> [目标程序， xxx.o] -> 链接器 -> [可执行程序]，预处理是我们程序编译开始的第一个步骤，那么在C语言我们主要使用到下面几个预处理的指令。
- 文件包含
替换为指定的文件名中的内容
examples:
```c
// 根据定义的规则查找文件
#include <stdio.h>
// 从源文件所处位置查找文件
#include "mytool.h"
```
- 宏定义
形式如：`#define 名字 替换文本`
规则：
1. 定义的**名字**的作用域从其定义的位置开始
2. 替换文本可以是任意字符串，一个较长的宏定义可以分为多行，待续文本用`\`连接。 
3. 宏定义可以使用前面定义的宏，替换仅对记号进行，对引号中的内容和部分匹配不做替换，如:
   eg:
   ```c
   #include <stdio.h>
   #define NAME "pino"

   //对于引号中的内容不做替换
   //上面定义的NAME不会去替换引号中的NAME
   #define PRINTNAME printf("NAME\n")

   //对于部分匹配的内容不做替换
   //上面定义的NAME不会去替换MYNAME中的NAME
   #define INCLUDENAME char *MYNAME="daemon"

   int main(){
       printf("%s\n",NAME);
       PRINTNAME;
       INCLUDENAME;
       printf("%s\n", MYNAME);
       return 0;
   }
   ```
   一些其他的例子
   ```c
   //定义一个死循环
   #define forverloop for(;;)
   
   //带参数的宏定义
   #define max(A,B) (A)>(B)?(A):(B)

   //带参数的宏定义的参数如果在替换文本中以#开头，会视为文本进行拼接,
   #define dprint(expr) printf(#expr"=%g\n",expr)
   //实际上被替换为
   dprintf(3/5) -> printf("3/5=%g\n", 3/5);

   //取消宏定义
   #undef forverloop
   ```
- 条件包含
条件包含可以对预处理流程做控制，当#if中的条件(一个整型表达式，不可包含sizeof,类型转换，enum常量)判断不为0时，则包含下面的内容，直到碰到#endif, #elif, #else为止。
```c
#if SYSTEM == SYSV
    #define HDR "sysv.h"
#elif SYSTEM == BSD
    #define HDR "bsd.h"
#elif SYSTEM == MSDOS
    #define HDR "msdos.h"
#else
    #define HDR "default.h"
#endif
#include HDR
```

#### git clone速度较慢
本来想将spring-boot的代码clone下来观摩一番，在几次三番的clone操作都以connection reset告终后，查阅有几种方式提速，下面提供一种较简单的方式，修改hosts文件。

1. hosts file location:
   - for windows:`C:\Windows\System32\drivers\etc`

2. 查找github的ip地址
使用下面的网站查找ip
`https://www.ipaddress.com/`

3. 固定github.com的ip地址，不在使用dns分配的ip地址去访问
在hosts文件末尾添加下面内容
`192.30.253.112 github.com`

这种方式已经能将速度提升至200KB/s呢，相较之前10KB/s左右的速度已经有很大改善呢，如果你尝试后效果不明显，请试试梯子吧(eg:shadowsocks:https://portal.shadowsocks.to,一个收费但很稳定的梯子)

#### git checkout fail: FILE NAME TOO LONG
今天clone一个仓库时碰到下面的错误，由于路径太长，git不能检出到工作分区。报错如下图
{% asset_img git_checkout_failure.png git_checkout_failure %}

解决方法如下:
1. 配置git core的longpath属性
   ```
   # 配置全局
   git config --global core.longpaths true
   # 配置单个项目
   git config core.longpaths true
   ```

2. 重新检出到工作分区
   ```
   git checkout -f HEAD
   ```

