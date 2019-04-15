---
title: 浏览器视口(viewport)的二三事(part two)
date: 2019-04-09 10:39:07
tags: viewport
categories: translation
---

#### 浏览器视口的二三事(part two)

**在这个小系列中我将会解释viewports和一些重要的元素(比如`<html>`, window和screen)的宽度是如何工作的**

在这篇文章中，我将会介绍移动端浏览器视口相关的概念，如果你完全没有接触过移动端的浏览器，我建议你先读我文章关于桌面浏览器相关概念的[第一部分](https://blog.llcat.tech/2019/04/04/a-tale-of-two-viewports/#more)，便于你对接下来介绍的概念有个基础。

<!-- more -->

#### 移动端浏览器的问题(The problem of mobile browsers)
当我们对比移动端浏览器和桌面端浏览器时，首先最明显的不同就是屏幕的尺寸，手机显示屏能显示的空间是远远小于基于桌面浏览器设计的网站的大小的。无论你是缩小到字体完全看不到的程度，还是仅显示你站点的一小部分内容，都是不合理的。

手机显示屏的尺寸远远小于pc显示屏的尺寸，想一想最大宽度是400px,有的时候会更小。一些中间尺寸的设备比如平板(Ipad等设备)，大小位于手机和电脑之间。但也不能解决问题，因为一些网站必须工作在手机上，所以我们需要想办法让这些网站能在手机设备上正常显示。

最主要的问题集中在CSS上，特别是视口的尺寸问题，如果我们按照1:1的大小使用桌面端的样式，那我们的CSS样式将会显示的一团糟。

让我们回到我们之前的例子，给定我们的侧边栏的宽度为10%,假设移动端和pc端都使用这个标准，那么在移动端这个侧边栏将会只有40px宽，这个宽度就太窄呢，你的布局将会看起来非常糟糕。

解决这个问题的方法之一是为移动端的站点从写一套代码。但是只有极少数的网站所有者能充分的利用，否则就是资源浪费。

手机浏览器的服务商想要给他们的客户提供较好的使用体验，现在这意味着需要尽可能的像桌面浏览器一样，所以我们需要一些手段以达到目的。

#### 两个视口(The two viewports)
所以相对于你的CSS布局，视口尺寸太窄呢，显而易见的解决方案是我们把视口变宽，因此，要求我们分离出两个概念，可视视口(visual viewport)和布局视口(layout viewport)。

乔治.康明斯(George Cummins)在stackoverflow上解释了[基础概念](http://stackoverflow.com/questions/6333927/difference-between-visual-viewport-and-layout-viewport)

> 想象下布局视口是一副不会改变尺寸和形状的很大的图片，现在你通过一个很小的相框去看这副图片，这个相框的周边都是不透明的，所以你只能看到这幅图片的一部分。那么你能看到的这一部分就被称作为可视视口。你可以在拿着这个相框远离这个大图片(缩小)以查看整个图像，或者你可以靠近(放大)以查看大图片的一部分。但大图片(布局视口)的大小和形状永远不会更改。

你还可以看一下克里斯(Chris)的[解释](http://stackoverflow.com/questions/7344886/visual-viewport-vs-layout-viewport-on-mobile-devices)

所以可视视口只显示当前页面的一部分，用户可以滚动以查看页面的其他部分，或者缩放改变可视视口的大小。
{% asset_img mobile_visualviewport.jpg mobile_visualviewport %}

然而，CSS布局,特别是百分比宽度，是相对于布局视口的宽度计算的，这样会看起来比可视视口宽的多。你的CSS宽度被解释的比你的屏幕宽很多，这可以确保你网站的布局和桌面浏览器上的布局一致。

但是移动端浏览器上的布局视口的宽度是多少呢？这一点上每个浏览器不一样，safari上是980px,opera是850px,android webkit是800px,ie是974px。


#### 缩放(Zooming)
显然，所有的视口都是基于CSS像素测量的，但是当可视视口缩放而变化，(如果你放大，更少的CSS像素适应你的屏幕)，但是布局视口的尺寸依然保持不变。(如果不这么做，你的页面将会不断重排，因为需要计算百分比宽度)

#### 理解布局视口(Understanding the layout viewport)
为了理解布局视口的大小，我们先看一下页面完全缩小时会发生什么，很多的移动端浏览器最初以完全缩小的页面显示任何页面。

重点是：浏览器选择了布局视口的尺寸，使其在完全缩小的情况下覆盖整个屏幕。(此时时等于可视视口的)

{% asset_img mobile_viewportzoomedout.jpg mobile_viewportzoomedout %}

因此，布局视口的宽度和高度等于在最大程度缩小模式下的显示的宽高，当用户放大时，这些尺寸保持不变。

{% asset_img mobile_layoutviewport.jpg mobile_layoutviewport %}

布局视口宽度始终相同，如果旋转手机，可视视口将会变化，但浏览器会通过稍微放大以适应新的方向，以使布局视口再次与视觉视口一样宽。

{% asset_img mobile_viewportzoomedout_la.jpg mobile_viewportzoomedout_la %}

这会对布局视口的高度产生影响，现在高度远远小于纵向模式，但是对于我们web开发者来讲，只考虑宽度。

{% asset_img mobile_layoutviewport_la.jpg mobile_layoutviewport_la %}
未完待续。。。