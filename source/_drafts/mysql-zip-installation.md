---
title: MySQL8.0 免安装版本使用指南
date: 2019-04-17 14:24:49
categories: database
---

#### MySQL8.0 免安装版本使用指南
在window平台上，MySQL同时提供了`msi installer`和解压即用的zip安装包。官方推荐直接使用`msi installer`安装使用，这样比较省心，但是使用zip档的免安装版本可以体验一下设置MySQL启动时的配置文件，初始化数据文件夹，配置相关工具的环境变量，配置MySQL为系统服务的过程，这样可以做到心中有数，感觉会比较好点。[官方文档](https://dev.mysql.com/doc/refman/8.0/en/windows-install-archive.html)也提供了很详细的说明，大家感兴趣可以看一下。

<!-- more -->

#### 创建配置文件
> 下载解压啥的我就不细说，日常操作，MySQL[官方下载地址](https://dev.mysql.com/downloads/mysql/)

下载并解压到你指定的文件目录后，我们需要先一个配置文件
