---
title: hexo+githubpages搭建个人blog
date: 2017-04-13 21:29:35
tags: 
- github pages
- hexo
categories:
- others
---
#### 为什么我要选hexo?
一直以来想要自己搭个博客,甚至有想建站搭个动态博客的想法,但是败给了懒......
然后在逛一些大大的blog时发现,他们的博文写的好也就算了,为啥界面还这么好看,然后就就发现了hexo这个草鸡漂亮而且方便好用的blog框架,好吧,种草许久了,早就想拔呢,最近这段时间也想把先前写在wiznote中的笔记转出来,好吧,那让我们开始愉快的动手吧。

#### 工具准备（带把小铁锤开始我们的工作吧）

tool | link
- | -
git | https://git-scm.com/
node.js | https://nodejs.org/en/
github pages| https://pages.github.com/

上面列举的工具就是我们接下来会用到的啦，请大家根据需要自行去官网下载:-O
因为我是用的linux-ubantu,所以git是自带的，我需要准备工具
只有node.js呢，当然我会在后面给出相关工具安装使用的帖子，希望能帮到大家。

- node.js的安装
好吧，Linux下好像不需要装，下载后解压即用，真刺激。需要注意的是为了方便使用，我们最好需要对node,和npm做两个全局的链接。
```
# 我将node.js执行文件解压后放在了 /usr/local/node/呢，当然这个你们随意啦
# ln(link) -s (建一个软链接) 源文件(解压后的目录下的程序）  目标文件(生成的链接文件） 
ln -s /usr/local/node-v6.10.2/bin/node /usr/local/bin/node
ln -s /usr/local/node-v6.10.2/bin/npm /usr/local/bin/npm
```
- hexo安装
hexo安装命令就在他们的官网首页，相当的简单，just one!
```
# 可能我们需要给hexo也配置下全局的一个链接，同上
npm install hexo-cli -g
```
到此我们需要的工具准备完毕了，如果大家在安装过程中遇到了什么困难，可以参考下面的文档或blog
> [hexo 中文文档](https://hexo.io/zh-cn/)
[ubantu下安装hexo blog](https://segmentfault.com/a/1190000002665530)

#### 开始用它之前尝试了解它吧

hexo给我们提供了详尽的文档，很多具体的细节需要我们去通读一遍[hexo docs](https://hexo.io/zh-cn/),下面是我自己对文档内容的一些梳理。

- 大体步骤
  - [建站](#create-site)
  - [更改配置文件](#edit-config)
  - [写作](#writing)
  - [部署](#deploy-blog)

<h5 id='create-site'>建站</h5>
    
```
hexo init blog
cd blog
npm install
hexo server
```
    
上面的几条命令是建站的基本命令了，其中npm install默认是安装需要的工具，其中包括了我们的hexo server,所有安装的工具都可以在根目录下的package.json中看到了。
hexo init 之后，整个文件夹变为我们的工作目录，目录结构如下：

```
.
├── _config.yml
├── package.json
├── scaffolds
├── source
|   ├── _drafts
|   └── _posts
└── themes
```

文件 | 作用
- | -
_config.yml | 我们配置的主要信息都在这，网站标题，url，站点存放目录，主题，模板设置等，[详情](#detail-config)
package.json | 已经安装的工具信息
scaffolds | 模板文件，我们的每篇blog肯定有一些相同的内容，如开头的[front-matter](https://hexo.io/zh-cn/docs/front-matter.html),默认scaffolds文件夹中包含3个模板，post.md,page.md,drafts.md对应了我们三种layout(布局）
source | 存放一些源文件，包括我们的blog.md,在_post中存放那个的是以hexo [layout,default post] new title.md建立的文件
themes | 主题，你可以在[hexo-themes](https://hexo.io/themes/)挑选一个自己喜欢的主题替换默认的landscape,我使用了litten大大的[yilia主题](https://github.com/litten/hexo-theme-yilia)


<h5 id='edit-config'>修改配置文件</h5>

我们需要简单修改下默认的_config.yml文件，替换为自己的一些信息就可以使用呢，详情[参考](https://hexo.io/zh-cn/docs/configuration.html)
一般来说，我们仅需要修改下面几个相关内容的配置就可以使用了
- 网站

参数 | 说明
- | -
title | 网站的标题
description | 网站的描述
author | 作者
language | 网站使用的语言

- 网址

参数 | 说明
 - | -
url | 你blog的url,比如使用的是github pages,那么改为https:username.github.io
root | 根目录，一般为/，如果你想把部署的静态文件放在网站的二级目录www.xxx.com/blog下，设置为/blog

- 目录

配置工作目录的一些信息，比如源文件，标签文件，分类文件存放在那些目录下，对于新手来说，不需要更改此部分的配置

- 文章

对于文章的一些设置，如设置标题格式，文章默认布局，是否显示草稿等


<h5 id = 'writing'>写作</h5>

我们开始写作时，需要新建一篇文章，使用hexo new 'xxx.md',这个命令会在source的_post中生成一个xxx.md文件，我们可以在scaffolds中建立自己的layout模板文件，使用自己的模板新建文章

```
# post是我们配置的默认模板，可以省略不写
hexo new post 'hexo+github pages搭建个人blog.md'
# 还可以使用自己的模板文件新建文章
hexo new myscaffolds 'xxx.md'
```

> 
> [markdown 语法]( https://guides.github.com/features/mastering-markdown/)

对于写好的文章，我们通过`hexo g `or `hexo generate`来生成静态文件，这些文件存放在public文件夹中，也是我们需要部署到网站上的文件，包括一些配置文件,html,css,js，img等。

<h5 id = 'deploy-blog'>部署blog</h5>

部署blog的方式有很多种，官方提供了多样化的部署方式，我们本次采用的方式是基于git部署我们的blog到github page上去，需要安装一个新的工具

```
npm install hexo-deployer-git --save
```
修改配置文件_config.yml
```
deploy:
  type: git
  repo: git@github.com:llcat/llcat.github.io.git
```
部署
```
hexo deploy
# 或者用简称
hexo d
```

<h5 id='my-error'>使用过程中的一些错误</h5>

> 自己出现的一些错误
开启了post_asset_folder: true后
将图片放在相应文件夹下时，使用hexo g生成文件时报错如下
FATAL ENOTDIR: not a directory, open '/home/ypl/StudyNotes/blog/public/java/了解Map容器/2017-04/abstract_map.jpg'
说找不到这个文件夹，百度了一圈后发现是在_config.yml文件中一个设置出现了错误，在year-:month后少打了一个反斜线，hexo认为我配置的这个永久链接是个文件，不是文件夹，更改配置如下后正常
permalink: :category/:title/:year-:month/






