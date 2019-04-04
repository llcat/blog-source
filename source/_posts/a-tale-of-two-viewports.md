---
title: 浏览器视窗(viewport)的二三事(part one)
date: 2019-04-04 10:33:47
tags: viewport
categories: translation
---

#### 浏览器视窗的二三事(part one)

**在这个小系列中我将会解释viewports和一些重要的元素(比如`<html>`, window和screen)的宽度是如何工作的**

这篇文章是介绍pc端浏览器的视窗，它的目的是为后续讨论相似的mobile端浏览器的视窗概念打基础。大多数的web开发者可能已经对pc端的视窗概念很清楚呢，在mobile端我们会发现有相同的概念，但是更加复杂。所以接下来我们会预先讨论一些大家都知道的术语，掌握这些术语对后续理解mobile端的视窗概念会很有帮助。

<!-- more -->

#### 概念：设备像素和CSS像素(device pixels and CSS pixels)
你需要知道的第一个概念是CSS像素以及它与设备像素的区别。

设备像素是我们从直观上能感受到的像素类型，设备像素为你使用的设备提供了一个正式的分辨率。(以我自己使用的显示屏为例，分辨率为1440*900)你可以简单粗暴的理解为在这块屏幕上横向上每行排列了1440个物理像素点，纵向上每列排列了900个物理像素点。
{% asset_img screen_info.jpg screen_info %}

在我们的浏览器中，我们通常可以通过`screen.width/height`来获取到这个值。
验证一下：
{% asset_img screen_wh.png screen_width_and_height %}

假设你给某个元素128px的宽度，你的显示器的设备像素宽是1024px，最大化显示你的浏览器窗口时，理论上是这样的8个元素刚好沾满你屏幕的宽度。
验证一下：(我的屏幕分辨率宽为1440px,我给每个元素定宽为144px,使用border-box,需要10个元素)
{% asset_img ten_item.png ten_item %}
确实，在缩放为100%时，一行排10个
代码如下:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style type="text/css">
        html, body {
            margin: 0;
            padding: 0;
        }
        .box {
            box-sizing: border-box;
            float: left;
            width: 144px;
            height: 144px;
            border: 1px solid red;
        }
    </style>
</head>
<body>
    <div class="box">1</div>
    <div class="box">2</div>
    <div class="box">3</div>
    <div class="box">4</div>
    <div class="box">5</div>
    <div class="box">6</div>
    <div class="box">7</div>
    <div class="box">8</div>
    <div class="box">9</div>
    <div class="box">10</div>
</body>
</html>
```
如果用户进行缩放，这个时候，计算方式就要变化呢，假设用户恰好放大到200%，你的CSS像素宽度为128px的元素仅需要5个就可以铺满设备像素宽1024px的显示器。(你可以取上面的例子，注释掉5个元素验证下)

在现代浏览器的中，缩放的实现只不过是做了一个拉伸像素的工作，简言之，就是你所看到的放大并不是将你定义的CSS像素宽128px的元素变为CSS像素宽256px的元素，作为替换，它实际上是将应该用来呈现在屏幕上的设备像素扩大了两倍，也就是原来一个CSS像素在显示屏上是由一个物理(设备)像素来展示，现在一个CSS像素需要两个物理像素来展示。
实际的元素的CSS像素仍然是128px,即使它现在在屏幕上占据了256px的空间。

换言之，放大到200%让一个CSS像素增长到一个设备像素大小的4倍(宽高各增加2倍，总共4倍)

下面的一组图可以用来阐释这个观点，假设4个像素在缩放为100%的情况下，什么也看不到，CSS像素是1:1完全覆盖在设备像素上的。
{% asset_img zoom_100.gif zoom_100 %}
接下来我们缩小，CSS像素开始收缩，意味着一个设备像素现在可以覆盖几个CSS像素呢。
{% asset_img zoom_out.gif zoom_out %}

如果你进行放大，相反的，CSS像素开始增大，现在一个CSS像素可以覆盖好几个设备像素
{% asset_img zoom_in.gif zoom_in %}

所以说我们的关注点只需要放在CSS像素上即可，CSS像素指定了你的样式表如何渲染。

设备像素对我们开发者基本是无用的，但对于用户来说，用户会缩放你的页面直到一个他觉得舒适的程度，但是，缩放的程度对你来说无关紧要，浏览器会自动自动确保你的布局被拉伸或压缩。

##### 100% zoom
在上面我们有提到过几次假设缩放为100%，那么我们现在给zoom 100%给一个更严格的定义。

> *zoom 100%指的一个CSS像素完全等于一个设备像素*

100%缩放的概念在接下来的一些概念解释中非常有用，但在日常的工作中你无须过于担心缩放带来的影响，在PC端我们一般是在100%的缩放下测试我们的网站，即使用户进行了放大或缩小的操作，神奇的CSS像素也会确保你的布局保持原有的比例。

#### 屏幕尺寸(Screen size)



> **tips:**
> 本文是一篇介绍浏览器viewport的译文，我觉得掌握这些知识对后续无论是pc端或mobile端的web开发工作会有很大的帮助，由于原文指向的中文翻译地址已经失效，故此在我的blog上在翻译一次。对于一些技术名词我会保留，以避免造成误解。个人能力有限，若翻译上有错误或不准确的地方，望大家斧正。[blog-source](https://github.com/llcat/blog-source)
> 原文: [A tale of two viewports(part one)](https://www.quirksmode.org/mobile/viewports.html)

