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

这会对布局视口的高度产生影响，现在高度远远小于纵向模式，但是对于我们web开发者来讲，可以只考虑宽度。

{% asset_img mobile_layoutviewport_la.jpg mobile_layoutviewport_la %}

#### 测量可视视口(Measuring the visual viewport)
对于可视视口来说，我们一般通过`window.innerWidth/Height`来读取，显而易见，测量值将会随着用户缩放而变化，所以在屏幕上会显示更少或更多的CSS像素。

{% asset_img mobile_inner.jpg mobile_inner %}

不幸的是这里仍然存在着不兼容性，许多的浏览器需要添加支持才能测量可视窗口的尺寸，但是，还没有浏览器将可视视口的测量值存在其他的键值对中(还记得第一部分我们的桌面浏览器可以通过两个键拿到视口的测量值)，所以我猜测`window.innerWidth/Height`是一个标准，尽管没有得到很好的支持。

#### 屏幕(The screen)
在桌面端，`screen.width/height`表示屏幕尺寸(基于设备像素)，作为一个开发者，我们可能永远用不上这些信息，我们对一块屏幕的物理尺寸不感兴趣，但是我们需要关注当前的屏幕上覆盖了多少CSS像素。

#### 缩放程度(The zoom level)
我们不能直接读取缩放的程度，但是你可以通过window.innerWidth/screen.width来计算它,当然前提是这两个属性都被很好的支持呢。

幸运的是缩放程度并不重要，你需要的知道的仅是当前的屏幕上有适配有多少CSS像素，你可以通过`window.innerWidth`获取到这个值，如果他被正确支持的话。

#### 滚动偏移量(Scrolling offset)
还有一个你需要知道的值是可视视口相对布局视口的位置，也就是滚动偏移值，跟PC端浏览器一样，他存放在`window.pageX/YOffset`中。

{% asset_img mobile_page.jpg mobile_page %}

#### `<html>`元素(`<html>` element)
和桌面浏览器一样，`document.documentElement.offsetWidth/Height`基于CSS像素单位给出了`<html>`元素的尺寸。

{% asset_img mobile_offset.jpg mobile_offset %}

#### 媒体查询(Media queries)
媒体查询的工作方式和桌面浏览器一致。`width/height`以布局视口作为参考，并使用CSS像素测量。`device-width/height`使用设备屏幕，使用设备像素进行测量。

换句话说，`width/height` 反应了`document.documentElement.clientWidth/Height`的值,而`device-width/height`反应了`screen.width/height`的值(基本所有的浏览器都是这么做的，即使这些镜像值并不准确)

{% asset_img mobile_mediaqueries.jpg mobile_mediaqueries %}

所以哪一个测量值对web开发者更有用呢？重点是，我也不知道。

一开始我认为`device-width`很重要，因为它给了我们可能会使用的设备信息，举个例子，你可以改变你布局的宽度已适应你设备的宽度，但是，你也可以使用`<meta viewport>`，所以使用`device-width`做媒体查询不是绝对必要。

所以`width`才是我们最重要的媒体查询值吗？可能是的，它提供了一些线索给我们，告诉我们浏览器提供商认为什么是一个好的尺寸对于显示在这台设备上的站点。但这是相当模糊的，基于`width`的媒体查询并没有提供任何其他的信息。

所以我还没有决定，目前我认为媒体查询对于区别不同类别的的设备(PC,Tablet,mobile)很重要，但对于区分同种类型不同尺寸的设备没那么重要。

#### 事件坐标(Event coordinates)
事件坐标或多或少和桌面浏览器是一致的。不幸的是，目前我测试的12个浏览器，只有Symbian Webkit和Iris能拿到正确的值(应该是作者很早之前的测试)，其他的浏览器或多或少都有一些问题。
`pageX/Y`依然是相对于页面位置测量的CSS像素值，这是在三个键值对中最有用的值，跟桌面浏览器一样。
{% asset_img mobile_pageXY.jpg mobile_pageXY %}

`clientX/Y`是相对于可视视口的位置(CSS像素)，这是有道理的，虽然我完全不知道他有什么好处。

`screenY/Y`是相对与屏幕的位置(设备像素)，当然它的值和`clientX/Y`是一样的。设备像素是没有用的，所以我们不必要考虑`screenX/Y`,他在桌面浏览器中一样无用。

{% asset_img mobile_clientXY.jpg mobile_clientXY %}

#### 元视口(Meta viewport)
最后，我们讨论一下`<meta name="viewport" content="width=320">`,它最初是苹果的浏览器上才有的拓展，但后来被越来越多的浏览器厂商支持呢，它意味着我们可以调整布局视口的尺寸，为了理解为什么这么做是必须的，让我们往后退一步测试下。
假设你构建了一个简单的页面，并且没有给你的元素任何的宽度，那么他会拉升并占据100%的布局视口的宽度，大部分浏览器会缩小以在屏幕上显示完整的布局视口，效果像下面这样：

{% asset_img mq_none.jpg mq_none %}

所有的用户都会立即放大查看，它可以工作，但是大部分的浏览器会保持元素的尺寸，这让很多文本难以阅读。

{% asset_img mq_none_zoomed.jpg mq_none_zoomed %}

(比较意外的是Android Webkit, 它减小了包含文本元素的尺寸以让它适应屏幕，这个做法非常聪明，我觉得所有的浏览器都应该复制这个行为)

现在你可以尝试设置`html {width: 320px}`,现在`<html>`元素缩小到320px,它内部的元素也是取320px的100%的长度。这种模式对于用户放大时是合适的，但是初始的界面有不正常呢，用户会面对一个看起来缩的很小的页面。

{% asset_img mq_html300.jpg mq_html300 %}

为了解决这个问题，苹果发明了meta viewport标签，当你设置`<meta name="viewport" content="width=320">`时，布局视口的宽度就是320px,这个时候初始化状态的页面显示也是正确的。

{% asset_img mq_yes.jpg mq_yes %}

你可以设置布局视口的尺寸为你想要的任意单位，包括`device-width`，这样你就可以根据你的`screen.width`来调整你的布局视口的尺寸。

不过，这里有一个问题，又是正式的`screen.width`并没有多大意义，因为像素太高呢，例如，Nexus One的正式宽度为480px,但是谷歌的工程师认为480px太宽呢，所以他们将它缩小到了2/3，因此`device-width`将会给你320px的值，就跟iphone上一致。
如果传言新的iphone将会有更大的像素(不一定是更大的屏幕)，如果Aplle复制这种行为，我也不会感到惊讶，或许到最后，设备宽度仅仅意味着320px。

#### 相关研究(Related research)
几个相关的主题，你可以进一步研究下:
- `position: fixed`, 我们知道，一个固定的元素，他是相对于视口固定的，但是是相对那个视口呢？

- 其他的媒体查询单位: dpi, orientation, aspect-ratio.特别是dpi,所有的浏览器都报96dpi,但这通常是错的，而且我完全不确定web开发者感兴趣的单位是什么

- 档一个元素比布局视口(layout viewport)/HTML远远要大时会怎么样？假如说我有一个1500px宽的元素，这个元素将溢出html元素，设置了`overflow: visible`,这就意味着实际的视口比布局视口还要宽，此外，旧的Android浏览器放大了HTML元素，这是个好的主意吗？

> **tips:**
> 本文是一篇介绍浏览器viewport的译文，我觉得掌握这些知识对后续无论是pc端或mobile端的web开发工作会有很大的帮助，由于原文指向的中文翻译地址已经失效，故此在我的blog上在翻译一次。对于一些技术名词我会保留，以避免造成误解。个人能力有限，若翻译上有错误或不准确的地方，望大家斧正。[blog-source](https://github.com/llcat/blog-source)
> 原文: [A tale of two viewports(part two)](https://www.quirksmode.org/mobile/viewports2.html)
