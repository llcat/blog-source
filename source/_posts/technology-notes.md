---
title: technology_notes
date: 2018-08-05 22:28:54
tags:
  - technology
---

#### 技术备忘录
可能是年龄大了，记忆力越来越不好呢，本着好记性不如烂笔头的原则，将一些可能会用到的一些技术方面的杂项记录下来。
#### js访问soap协议的接口
如果你的后台项目是基于soap协议编写的webservice,推荐一个jquery的插件，可以简化请求过程。
jquery.soap:https://github.com/doedje/jquery.soap
非常好使，解决了我最近项目中的痛点，毕竟自己去基于soap协议封装请求还是相当麻烦的，有好轮子就直接用吧。
#### 使用nginx完成反向代理并允许跨域请求
最近需要将原有的一个android项目，基于vue.js重写为一个spa以兼容多个平台的使用，在从后端拿数据时碰到了这样的问题，本地调试时遇到了浏览器的同源限制，想拿数据非常不方便。想到了下面几种方法：
- 我们的web app可以与早先已有的后台项目部署在同一台服务器上。(然而，不现实，仅仅是用来开发调试的情况下，后台team不会允许我们随便摆弄他们的服务器的)
- 后台team给他们项目的返回头中添加`Access-Control-Allow-Origin`等字段，允许跨源访问。(沟通无果，后台team不想加)
- `jsonp,iframe`等技术绕过浏览器的限制。(写起来巨麻烦，还有一些限制，很不爽)
- 自己写个中间层去转一下，自己用`python`基于`flask`写了中间层去请求，然后前端请求用自己写的接口，但这样调试用写两个接口用下还行，几十几百个接口也不可能一个个的去写。(当然，这里还是赞下py的简洁性，解决跨域访问引入`flask-cors`一句话就解决了)
- 绝招: 使用`nginx`的反向代理，并在返回头中添加允许跨源访问的字段。
  
使用nginx做反向代理是最简单有效的,配好后就可以轻松的使用呢，下面给出我的配置：
```
server {
        listen       8080;
        server_name  localhost;
        location / {
            if ($request_method = OPTIONS ) {
                return 204;
            }
            add_header Access-Control-Allow-Origin '*';
            add_header Access-Control-Allow-Methods 'GET, PUT, POST, DELETE, OPTIONS';
            add_header Access-Control-Allow-Headers 'content-type,soapaction,*';
            proxy_pass    http://your-ip:port/;
        }
    }
```
说明：
1. 因为我使用的后端api是基于soap编写的webservice,请求的资源类型是非常规的,所以浏览器会自动帮我发送一个OPTIONS请求去询问服务器是否支持接下来的跨域请求，比如我的这个OPTIONS请求，头部中包含下面的字段，说的意思是你帮忙看下我接下来跨域的请求的方法是POST,请求的头部中包含`content-type`和`soapaction`这两个字段，你支持吗？
   ```
   Access-Control-Request-Method: POST
   Access-Control-Request-Headers: content-type,soapaction
   ```
   那我们作为一个方向代理服务器，当然不用去验证什么，所以如果我们拦截到方法是OPTIONS,直接返回状态码204即可，告诉浏览器，你只管发下一个请求吧，返不会结果算我输~
2. 那么接下来，我们的nginx自然是把接下来的POST请求直接转发给我们的代理服务器去处理，可以看到这个POST的请求头部中是有刚才OPTIONS请求中提到的字段，如`SOAPAction:listAllVmInfoByUserId`,完整头部如下：
   ```
   Host: localhost:8080
   Accept: application/xml, text/xml, */*; q=0.01
   Accept-Language: zh-CN,en-US;q=0.7,en;q=0.3
   Accept-Encoding: gzip, deflate
   Referer: http://localhost:8082/
   Content-Type: text/xml; charset=UTF-8
   SOAPAction: listAllVminfoByUserId
   Content-Length: 307
   Origin: http://localhost:8082
   Connection: keep-alive
   Cache-Control: max-age=0
   ```
3. 我们代理的服务器上的资源实际上是不支持在浏览器中跨源访问的，所以他的response的头部中是不会有允许跨源访问的相关字段的，这个时候靠我们的nginx的`add_header`的指令给response中增加我们想要的头部即可，如`Access-Control-Allow-Methods, Access-Control-Allow-Headers`等字段,告诉浏览器我们允许跨域访问喔，返回的数据请收好，整个流程完毕。

#### Win10远程桌面Ubuntu16.04
Ubuntu开启远程桌面共享后，想要用win10自带的远程桌面访问，还需要在ubuntu主机上完成下面的配置。
1. 开启远程桌面共享，见下图
{% asset_img open_desktop_share.PNG open_desktop_share %}
2. 安装xrdp
```sh
sudo apt-get install xrdp
# 查看服务是否开启
service --status-all
# 若没开启
service xrdp start
```
3. 安装dconf-editor
```
sudo apt-get install dconf-editor
```
安装完成后，运行dconf-editor,依次展开org->gnome->desktop->remote-access
去掉require-encryption的勾选，如下：
{% asset_img cancel_encryption.png cancel_require_encryption %}

4. 使用win10远程桌面连接
选择vnc-any,输入相关信息连接即可
{% asset_img win_remote_desktop.PNG win_remote_desktop %}
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
  
- 新安装docker后，设置非root用户可使用
  1. 添加docker用户组
  ```
  sudo groupadd docker
  ```
  2. 将当前用户添加到用户组
  ```
  sudo usermod -aG docker $USER
  ```
  注销当前用户在重新登陆即可使用


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
{% asset_img git_checkout_failure.PNG git_checkout_failure %}

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

