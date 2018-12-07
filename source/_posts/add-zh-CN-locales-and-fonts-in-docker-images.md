---
title: 给Docker镜像(Debian)添加中文支持和中文字体
date: 2018-12-03 10:18:59
tags: locales and fonts
categories: docker
---

#### 前言
最近有碰到这样的一个问题，在Docker容器中生成的pdf文件中的中文内容全部丢失，英文内容显示正常。任务场景是这样的：我司的代码全部托管在Gerrit上，开发者提交或者打版本tag后触发Jenkins完成一系列的CI流程，我需要开发一个当打完版本tag后能自动生成发布文档的功能，大体上的步骤就是获取信息(tag下的提交信息，病毒扫描，测试报告等)拼接成模板后生成发布文档即可，技术栈就选用了node.js,主要依赖了两个工具包[markdown-pdf](https://www.npmjs.com/package/markdown-pdf)和[request](https://www.npmjs.com/package/request),`markdown-pdf`支持用CSS自由控制样式，实现的效果还是很理想的。最后生成文档应用我是打包到docker镜像中为了方便集成到Jenkins的CI流程中，但是碰到了一点问题，就是上面说的中文内容不显示的问题，查阅资料过程中发现也没有较完整的文章介绍，在此与大家分享我解决的流程以供后面遇到问题的人参考。

<!--more-->

#### 添加locales
一开始我的Dockerfile是这样写的，依赖于`node:10.13`，并未做什么特殊的处理。
```Dockerfile
FROM node:10.13
LABEL "author"="pino"
LABEL "version"="1.0"
LABEL "description"="use to generate release note when jenkins build"
ENV GERRIT_PROJECT "pass from jenkins"
ENV GERRIT_REFNAME "pass from jenkins"
ENV JENKINS_JOBNAME "pass from jenkins"
ENV JENKINS_BUILD_ID "pass from jenkins"
WORKDIR /home/pino/app
ADD . /home/pino/app/
CMD ["npm", "start"]
```

一开始做文档生成时没有啥问题，但在后续有人发现文档中的中文内容是缺失的，我开始在本地测试，发现在本地测试时生成的文档内容是正常的，中英文都是可显示的，于是我怀疑应该是与程序的运行环境有关，那么运行时的docker container中相比本机环境少了些什么呢？

我首先想到的是编码问题，是不是容器中没有合适的字符集导致没办法识别中文呢，朝着这个方向去查阅资料我发现了linux是支持本土化(locales)的，那我们首先检查下container内的字符集是不是有正确的设置呢

```sh
# 运行node.js容器
docker run -it --name node_test node:10.13 bash
# 查看系统的locale
locale
# 查看系统所有的locale
locale -a
```

```
root@3035b11daef5:/# locale
LANG=
LANGUAGE=
LC_CTYPE="POSIX"
LC_NUMERIC="POSIX"
LC_TIME="POSIX"
LC_COLLATE="POSIX"
LC_MONETARY="POSIX"
LC_MESSAGES="POSIX"
LC_PAPER="POSIX"
LC_NAME="POSIX"
LC_ADDRESS="POSIX"
LC_TELEPHONE="POSIX"
LC_MEASUREMENT="POSIX"
LC_IDENTIFICATION="POSIX"
LC_ALL=

root@3035b11daef5:/# locale -a
C
C.UTF-8
POSIX
```

可以看到容器默认使用的locale是POSIX,是不支持中文编码的，查阅到有的资料说C.UTF-8是支持中文编码的，但我为了保险起见，采用看起来更靠谱的zh_CN.UTF-8,在容器中支持的所有locale中是不包含zh_CN.UTF-8，所以需要我们手动安装。所以我在Dockerfile中添加了下面这几行

```Dockerfile
RUN apt-get update
RUN apt-get install -y locales
RUN sed -ie 's/# zh_CN.UTF-8 UTF-8/zh_CN.UTF-8 UTF-8/g' /etc/locale.gen
RUN locale-gen
ENV LANG zh_CN.UTF-8
```

上面的几条指令总的来说就是安装了所有的本地化支持，并在locale.gen这个配置文件中开启zh_CN.UTF-8的支持，最后重新生成locale并设置了环境变量LANG为zh_CN.UTF-8。

运行我们新构建的镜像并查看locale

```
root@0fd809a673a7:/home/pino/app# locale
LANG=zh_CN.UTF-8
LANGUAGE=
LC_CTYPE="zh_CN.UTF-8"
LC_NUMERIC="zh_CN.UTF-8"
LC_TIME="zh_CN.UTF-8"
LC_COLLATE="zh_CN.UTF-8"
LC_MONETARY="zh_CN.UTF-8"
LC_MESSAGES="zh_CN.UTF-8"
LC_PAPER="zh_CN.UTF-8"
LC_NAME="zh_CN.UTF-8"
LC_ADDRESS="zh_CN.UTF-8"
LC_TELEPHONE="zh_CN.UTF-8"
LC_MEASUREMENT="zh_CN.UTF-8"
LC_IDENTIFICATION="zh_CN.UTF-8"
LC_ALL=

root@0fd809a673a7:/home/pino/app# locale -a
C
C.UTF-8
POSIX
zh_CN.utf8
```

可以看到这个时候我们已经成功的添加了中文编码支持，然而我再次测试时发现生成的文档的中文内容还是缺失，那我们还需要给容器环境添加一些什么呢？

#### 添加fonts

我们知道一个文字渲染到屏幕上显示是需要对应的字体文件支持的，比如大家耳熟能详的微软雅黑，方正宋体等等，在浏览markdown-pdf的文档时，发现他是用phantom.js做的渲染，那是不是由于容器中缺少了字体文件导致中文文本不能被正常渲染出来呢？我们还是重新运行一个node容器看看。
```sh
# 运行node.js容器
docker run -it --name node_test node:10.13 bash
# 查看系统所有的字体
fc-list
# 查看字体的详细信息
fc-list -v | grep zh
```

可以看到容器中的字体文件如下
```
root@239783fb404a:/# fc-list
/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf: DejaVu Serif:style=Bold
/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf: DejaVu Sans Mono:style=Book
/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf: DejaVu Sans:style=Book
/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf: DejaVu Sans:style=Bold
/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf: DejaVu Sans Mono:style=Bold
/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf: DejaVu Serif:style=Book
```

我们使用grep做过滤时发现上面的这些字体文件都是不支持中文的。ok，我们离解决问题更近一步呢，既然没有字体文件，那我们自己加吧！

我从win10中随便拷贝了几个字体文件做测试，这个应该是有版权的，如果大家是商用一定注意，windows的字体文件全部都存放在`C:\Windows\Fonts`中。准备好字体文件后，我在Dockerfile中加了下面的指令

```Dockerfile
RUN mkdir /usr/share/fonts/truetype/deng/
ADD ./fonts/deng/*.ttf /usr/share/fonts/truetype/deng/
RUN fc-cache -vf
RUN fc-list
```

上面这几条指令主要是在容器存放字体文件的目录下新建了个目录存放等线字体，将工程目录下我准备好的文件拷贝到容器中，执行字体文件更新，最后查看下是否成功添加，当然最后一条指令是可以不加的。

重新构建镜像后在重新运行进去看看，会看到我们添加的字体是支持中文的，如下：
```
root@09b3809c5d03:/home/pino/app# fc-list -v | grep zh
        familylang: "zh-cn"(s) "en"(s)
        fullnamelang: "zh-cn"(s) "en"(s)
        lang: aa|ay|bg|bi|br|ca|ch|co|cy|da|de|el|en|es|et|eu|fi|fj|fo|fr|fur|fy|gd|gl|gv|ho|ia|id|ie|io|is|it|kum|lb|mg|nb|nds|nl|nn|no|nr|nso|ny|oc|om|os|pt|rm|ru|sel|sma|smj|so|sq|ss|st|sv|sw|tk|tl|tn|ts|uz|vo|vot|wa|xh|yap|zh-cn|zh-sg|zu|an|fil|ht|jv|kj|ku-tr|kwm|li|ms|ng|pap-an|pap-aw|rn|rw|sc|sg|sn|su|za(s)
```

到此，做到这一步，我重新测试后发现生成的文档中文不显示的问题已经解决呢，附上完整的Dockerfile.

```Dockerfile
FROM node:10.13
LABEL "author"="pino"
LABEL "version"="1.0"
LABEL "description"="use to generate release note when jenkins build"
RUN apt-get update
RUN apt-get install -y locales
RUN sed -ie 's/# zh_CN.UTF-8 UTF-8/zh_CN.UTF-8 UTF-8/g' /etc/locale.gen
RUN locale-gen
RUN mkdir /usr/share/fonts/truetype/deng/
ADD ./fonts/deng/*.ttf /usr/share/fonts/truetype/deng/
RUN fc-cache -vf
RUN fc-list
ENV LANG zh_CN.UTF-8
ENV GERRIT_PROJECT "pass from jenkins"
ENV GERRIT_REFNAME "pass from jenkins"
ENV JENKINS_JOBNAME "pass from jenkins"
ENV JENKINS_BUILD_ID "pass from jenkins"
WORKDIR /home/pino/app
ADD . /home/pino/app/
CMD ["npm", "start"]
```