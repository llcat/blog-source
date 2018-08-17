---
title: technology_notes
date: 2018-08-05 22:28:54
tags:
  - technology
---

#### 技术备忘录
可能是年龄大了，记忆力越来越不好呢，本着好记性不如烂笔头的原则，将一些可能会用到的一些技术方面的杂项记录下来。

#### docker配置
记录以下常用的docker常会用到的配置
- 修改Docker daemon默认存储位置
  Docker daemon持久化所有的数据在一个目录下，包含容器，镜像，数据卷等等一切相关的信息。
  默认路径：
  Linux:`/var/lib/docker`
  Win:`C:\ProgramData\docker`
  假设你使用的linux系统，挂载的主分区分配的空间比较小需要更换docker daemon的存储路径。可以在`/etc/docker/daemon.json`中这样配置
  ```json
  {
      "data-root": "/home/your/path"
  }
  ```
  在之前配置时，还有使用过这样的写法，但是这次我在官方文档中没有找到，如下(在我的18.03版本的中，这样配置也是生效的)：
  ```json
  {
      "graph": "/home/your/path"
  }
  ```
  在`daemon.json`中对docker daemon作配置是官方推荐的做法。除此之外，还有启动命令行指定参数等，但这个做法显然比较简单。

- 给docker daemon配置代理HTTP/HTTPS代理
  如果你当前的环境在公司内网中，需要通过代理才能访问Internet,那么你想要从外部pull镜像时，也要给你的docker daemon单独配置代理，docker daemon是在启动时根据`HTTP_PROXY`,`HTTPS_PROXY`,`NO_PROXY`三个环境变量来配置HTTP/HTTPS代理的，要配置docker daemon的代理，我们需要做如下修改：
  1. 在systemd目录下为docker创建目录
  `sudo mkdir -p /etc/systemd/system/docker.service.d/`
  2. 创建http-proxy.conf或https-proxy.conf文件
  `touch /etc/syatemd/system/docker.service.d/http-proxy.conf`
  并在文件中添加下面的配置
  ```
  [Service]
  Environments="HTTP_PROXY=http://proxy-server-name-or-ip:port"
  ```
  如果你是走的HTTPS代理，在https-proxy.conf中添加上面的内容
  3. 如果你有内网的私有registries，可以配置哪些域名或ip不走代理。
  ```
  [Service]
  Environment="HTTP_PROXY=http://proxy-server-name-or-ip:port"
  Environment="NO_PROXY=localhost,127.0.0.1"
  ```
  4. 刷新配置并重启docker daemon
  ```sh
  sudo systemctl daemon-reload
  sudo systemctl restart docker
  ```
  


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

