---
title: 技术备忘录
date: 2018-08-05 22:28:54
tags:
  - technology
---

#### 前言
可能是年龄大了，记忆力越来越不好呢，本着好记性不如烂笔头的原则，将一些可能会用到的一些技术方面的杂项记录下来。

<!--more-->

#### 一些查看服务器状态常用的指令
- `free`
查看内存占用情况，请注意这里的内存使用情况跟你在top上看到的不一样，有不同的意义
```sh
# 以mb为单位查看内存占用情况
free -m
# 以gb为单位查看内存占用情况
free -g
# 以人类可读的方式查看内存占用情况
free -h
```

- `netstat`
查看一些网络连接相关情况
```sh
# 查看所有监听(LISTEN)了端口的进程名
# -t:指socket连接类型为tcp, -l:指listen状态的, -p:列出进程名及pid
netstat -tlp
```

- `top`
查看Linux系统的运行状态，包括cpu,内存等信息
```sh
# 查看系统运行的状态
top
# 进入后还可以选择一些指令,如按m来查看内存使用情况
```

- `ps`
ps(process snapshot)使用来查看当前进程的一个快照的
```sh
# 查看所有的进程状态
ps -aux
# 结合sort排序，head列出头几行
# sort -k 4 比较的键的位置在第四列(对于top的结果使memoey的占用比) -n:数值方式比较 -r:反向排序
# head -5 列出头5行
ps -aux | sort -k 4 -nr | head -5
```

- `df`
查看文件系统使用情况
```sh
# 以人类可读方式查看文件系统使用情况
df -h
```

- `du`
显示某个文件或文件夹占用的大小(disk usuage)
```sh
# 以人类可读方式查看当前目录所占的带下
du -h
```

#### a标签实现静态文件的下载。
在html5中a标签中新增了一个download属性，用来说明这是个下载链接，点击后浏览器会进行下载行为而不是链接跳转
```html
<a class="download-link" href="http://domain/static/pdf/test.pdf" download="test.pdf" >
```

#### vscode如何在jsx中开启emmet
在前端开发中，emmet基本上是我们离不开的插件，但是vscode默认是不再js中支持emmet的，所以手写jsx有点难受哈，查了下资料，发现我们可以配置在js中开启emmet,在vscode的seetting.json中加入下面的配置。

```json
"emmet.includeLanguages": {"javascript": "javascriptreact"}
```
如果你想同时支持vue模板，加这个：
```json
 "emmet.includeLanguages": {"vue-html": "html", "javascript": "javascriptreact"}
```

#### 关于python操作excel
最近接到一个任务是从zip档中解压出log文件，提取出相关的信息后填充到一个模板Excel表格中。考量了需求和自己技能栈后决定选用python完成自动化的工作及提供一个本地http服务器，用vue写一个页面提供配置和简化操作(提供给测试人员使用,有个UI可能更好上手)。在查阅了相关资料后选用`openpyxl`这个包来处理excel。
> `openpyxl`还在稳定的更新中，相较于以前使用过的`xlrd`和`xlwt`等工具提供了更完备的功能，这里给出参考
> [Python Excel](http://www.pythonexcel.com/)
> [openpyxl doc](https://openpyxl.readthedocs.io)

在实现过程中碰到了两个问题
- 模板template.xlsm这种文件格式是默认启用了宏的
  对于这种情况，我们使用`openpyxl`加载文件时需要指定`keep_vba`的参数位`True`,否则新保存的后缀为`*.xlsm`文件不能打开，Excel提示文件损坏。
  ```py
  wb = openpyxl.load_workbook("template.xlsm", keep_vba=True, )
  wb.save("test1.xlsm")
  ```
- 模板template.xlsm中带有图像，另存为新文件后图像会消失
  官方文档中也有提到openpyxl暂时不会读取已有文件中的图像和图表信息，所以在打开后在保存时会丢失图像。
  {% asset_img openpyxl_doc_img.png openpyxl_doc_img %}
  我查阅相关api时原本想用它提供的work_sheet.add_image(img, position)来手动解决，这个时候需要安装`pillow`作为依赖。
  ```py
  from openpyxl.drawing.image import Image
  wb = openpyxl.load_workbook("template.xlsm", keep_vba=True, )
  ws = wb["sheet1"]
  ws.add_image(Image("test.png"), "A1")
  wb.save("test1.xlsm")
  ```
  但实际上安装`pillow`包后，不在需要其他手动的操作，模板文件中的图片也不会在丢失，`openpyxl`帮我们做了处理，可能跟版本有关系，这应该是后来更新的功能，我用的是当前的最新版本`2.6.1`。

#### 使用nmcli管理网络连接
最近需要将远程的几台server互切一下ip,于是在网上找了一下远程切ip的方法，基本大体上可以归为修改network相关的配置文件，或者是使用ifconfig等工具修改，但我个人感觉都不是很灵活和方便，这里推荐一款ubuntu上自带的网络连接命令行管理工具`nmcli`,添加，删除和修改网络连接配置非常简单，这个工具支持的功能非常多，使用时注意活用`tab`和`help`。

```sh
# 添加一个以太网类型的连接，并指定连接名称，ip地址，网关地址。
# 这里注意,如果你的设备上有多张网卡，你想替换掉现有的连接，ifname(interface name)一定不要用*
# 使用你当前连接正在使用的ifname,这样在后续up切换时才能正常替换掉连接
sudo nmcli connection add type ethernet autoconnect yes ifname "*" con-name 70.188 ip4 10.203.70.188/23 gw4 10.203.70.1
# 修改连接的dns server地址。
sudo nmcli connection modify 70.188 ipv4.dns 10.202.2.102
# 切换到刚才建立的网络连接
sudo nmcli connection up 70.188
# 删除刚建立的网络连接
sudo nmcli connection delete 70.188
```

#### shell脚本变量的字符替换与截取
最近在将Jenkins上几个串连在一起工作的Jobs转换成一个Pipeline,看到同事之前写的shell中有一段字符串的变量中字符的替换和截取的功能，之前没见过，整理一下：
- 字符的替换
在shell中,使用/来做替换
说明：/expr1/expr2  使用expr2来替换表达式中匹配到的第一个expr1
     //expr1/expr2 使用expr2来替换表达式中匹配到的所有expr1 
```sh
# eg: 替换 foo/bar/nav为foo:bar:nav
s1 = "foo/bar/nav"
s2 = ${s1//\//\:}
# eg: 替换 abbc 为 acbc
s1 = "abbc"
s2 = ${s1/a/c}
# eg: 替换 abbc 为 accc
s1 = "abbc"
s2 = ${s1//a/c}
```
- 两端截取
在shell中，使用#完成匹配到某个字符后右端的截取(抛弃匹配到的左边的内容,包括该字符), 使用%完成匹配到某个字符后左端的截取(抛弃匹配到的右边的内容，包括字符)
说明：#expr 抛弃匹配到的第一个expr的左边内容,包括expr
     ##expr 抛弃匹配到的最后一个expr的左边内容,包括expr
     %expr 抛弃匹配到的最后一个expr的右边的内容，包括expr
     %%expr 抛弃匹配到的第一个expr的邮编的内容,包括expr
```sh
# eg: 以 /foo/bar/nav/my.test.txt 为例
s1="/foo/bar/nav/my.test.txt"
# s2="foo/bar/nav/my.test.txt"
s2=${s1#*/}
# s3="my.test.txt"
s3=${s1##*/}
# s4="/foo/bar/nav/my.test"
s4=${s1%.*}
# s5="/foo/bar/nav/my"
s5=${s1%%.*}
```
- 位置截取
在shell中使用:完成字符中任意位置的截取某长度的字符串
说明：${str:pos1:length}
```sh
# eg: /foo/bar/nav 截取其中的bar
s1="/foo/bar/nav"
s2=${s1:5:3}
```
#### 协调世界时(UTC) 1970/01/01 00:00:00
如果大家有使用过一些编程语言的Date相关的API,一定会看到文档中会提到的一个特殊的时间点1970/01/01 00:00:00，以这个时间点为时间原点,加上一个为正数的时间戳(距离时间原点经过的毫秒数)，可以表示时间原点向后的时间，加上一个负数的时间戳，可以表示时间原点之前的时间，我们以js为例(大家有兴趣可以在console下试试)：
```js
let d0 = new Date("1969/12/31 00:00:00")
let d1 = new Date("1970/01/01 00:00:00")
let d2 = new Date("1970/01/02 00:00:00")
d0.getTime() - d1.getTime()
// output: -86400000
d2.getTime() - d1.getTime()
// output: 86400000
```
那么86400000是一个什么值呢？其实算来也就是间隔一天的毫秒数呢，即1x24x60x60x1000

知道了时间戳的概念，我们只要基于某个时间原点，加上时间戳就可以推算出任意的一个时间，所以时间原点是一个什么值，只是我们计算的一个基点而已，但是在计算机的世界中，综合UNIX操作系统和计算机产生的年代等因素，大家统一以1970-01-01 00:00:00作为标准的时间原点。

如果你在不同的时区，这个时间原点实际上是要加上时区的偏移值的
```js
// 如果你在中国
d1.getTime()
// output: -28800000 = 8*60*60*1000
```
为什么是一个负值呢？那是因为我们所属的时区为UTC+8,那么我们应该基于的时间原点实际上是1970-01-01 08:00:00,我们在尝试一下
```js
let d3 = new Date("1970-01-01 08:00:00")
d4.getTime()
// output: 0
d3.getTimezoneOffset()
// output: -480
// js的时区偏移值以分钟为单位, 480 min/60 min = 8h
```
为什么getTimezoneOffset是个负值？
大家可以这样理解，我们所在时区的时间，要在协调世界时(UTC)上加8, 倘若我们的localtime(本地时间)加上一个偏移值要等于UTC，反过来就应该减8，也就是-480.

- 关于时间回归
  我看很多博文有提到一个时间回归的问题，具体来说，就是在早期的时候，大多数机器运行的都是32位的操作系统，在32位的操作系统中，如果以一个有符号类型的int值来表示时间戳，那么基于1970-01-01 08:00:00(我以东八区为例)能表示的最大时间是这样的

  ```js
  let d4 = new Date( (Math.pow(2, 31)-1) * 1000 )
  console.log(d4)
  // output: Jan 19 2038 11:14:07
  ```

  为什么是这个时间呢？
  因为在32位的操作系统中，有符号的整形是用补码的形式表示的，公式如下:
  {% asset_img b2t.png b2t%}
  也就是说，在w位的操作系统中，有符号的int类型的表示范围是[-2^(w-1), 2^(w-1)-1], 所以在32位系统中，补码能最大值就是 2^31-1，在往上加如果值大于2^(w-1)-1就会产生正溢出现象，所以在计算机系统中，c语言补码的加法定义了下面的规则：
  {% asset_img over_flow.png over_flow%}
  假设这个时候的时间戳的数值超过了整型数所能表示的最大值，发生正溢出，计算值为 1+( 2^31 - 1) - 2^32 = -2^31,那么此时时间戳为负数，所表示的时间变为1970-01-01之前的时间，这样就产生了所谓的时间回归的问题。

  ```
  let d5 = new Date( Math.pow(2, 31) * -1000 )
  console.log(d5)
  //output: Dec 14 1901 04:45:52
  ```

  很显然，这个问题并不具有普适性，比如对于不同的编程语言，对于整型数的实现并不一样，还有，随着技术的发展，越来越多的机器也开始运行着64位的操作系统。

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
   那我们作为一个反向代理服务器，当然不用去验证什么，所以如果我们拦截到方法是OPTIONS,直接返回状态码204即可，告诉浏览器，你只管发下一个请求吧，返不会结果算我输~
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

- 给docker container配置HTTP/HTTPS代理
  请参考[官方文档](https://docs.docker.com/network/proxy/),Docker 17.07前的版本只能手动指定，之后更高的版本可以在配置文件中统一配置，容器启动后docker会自动帮你设置这些环境变量。下面给出在配置文件中设置的方法，这重方式比较方便。(just for linux,win版本的gui设置比较容易找到)
  在`~/.docker/config.json`文件中添加以下内容
  ```json
  {
    "proxies":
        {
            "default":
            {
                "httpProxy": "http://ip:port",
                "httpsProxy": "http://ip:port",
                "noProxy": "*.test.example.com,.example2.com,10.203.78.71"
            }
        }
  }
  ```
  这样就给container配置好了http/https代理

- 给docker daemon配置代理HTTP/HTTPS代理
  如果你当前的环境在公司内网中，需要通过代理才能访问Internet,那么你想要从外部pull镜像时，也要给你的docker daemon单独配置代理，docker daemon是在启动时根据`HTTP_PROXY`,`HTTPS_PROXY`,`NO_PROXY`三个环境变量来配置HTTP/HTTPS代理的，要配置docker daemon的代理，我们需要做如下修改：
  1. 在systemd目录下为docker创建目录
  `sudo mkdir -p /etc/systemd/system/docker.service.d/`
  2. 创建http-proxy.conf或https-proxy.conf文件
  `touch /etc/systemd/system/docker.service.d/http-proxy.conf`
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

#### 使用git merge后会丢失Change-Id的问题
公司内部是使用gerrit管理源码的，我在本地做merge分支操作时，git在merge成功后自动帮我进行commit操作，但是这笔commit丢失了相关的Change-Id的信息，这是往gerrit服务器上push代码时必要的信息，否则会push不上去，针对这个问题，我们在merge后自己来手动commit解决，如下:

```sh
# 合并分支但不提交
git merge {branch_name} --no-commit
# 手动提交
git commit
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

