---
title: 浏览器视口(viewport)的二三事(part one)
date: 2019-04-04 10:33:47
tags: viewport
categories: translation
---

#### 浏览器视口的二三事(part one)

**在这个小系列中我将会解释viewports和一些重要的元素(比如`<html>`, window和screen)的宽度是如何工作的**

这篇文章是介绍pc端浏览器的视口，它的目的是为后续讨论相似的mobile端浏览器的视口概念打基础。大多数的web开发者可能已经对pc端的视口概念很清楚呢，在mobile端我们会发现有相同的概念，但是更加复杂。所以接下来我们会预先讨论一些大家都知道的术语，掌握这些术语对后续理解mobile端的视口概念会很有帮助。

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
{% asset_img ten_element.png ten_element %}
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
让我们来看一些实际的测量尺寸，我们首先来看看`screen.width`和`screen.height`，它们用来表示一个用户屏幕的所有的宽和高。这个尺寸是基于设备像素测量的，因为它永远不会变，它们是显示器的特性而不是浏览器的。
{% asset_img monitor_wh.png monitor_wh %}

非常有趣，但是我们如何处理这些信息？一般来说，什么都不用做，用户的显示器的尺寸对我们一点都不重要，除非你想测量他并用在一些统计数据库中。

#### 窗口尺寸(Window size)
相反，我们实际上想知道的是一个浏览器窗口的内部尺寸，这个尺寸会确切的告诉你当前有多少可用空间用于你的CSS布局，你可以通过`window.innerWidth`和`window.innerHeight`来获得窗口的尺寸。
{% asset_img desktop_inner.jpg desktop_inner %}

显然，浏览器窗口的内部尺寸是基于CSS像素测量的,你需要知道在浏览器窗口中有多少空间放置你的布局，这个尺寸会随着用户的放大而缩小，如果用户进行了放大操作，在浏览器窗口中你能使用的空间会变小，反映在数值上就是`window.innerWidth`和`window.innerHeight`这两个值会减小。

(在桌面上比较特殊的是Opera浏览器，它的`window.innerWidth/Height`不会随着用户放大而减小，因为他是基于设备像素测量的，这在桌面端可能令人有点恼火，但是这在手机端却是致命的缺陷，在后面我们会说明)

{% asset_img desktop_inner_zoomed.jpg desktop_inner_zoomed %}

<font color="red">注意：</font>这两个属性测量的宽高是包含滚动条的，滚动条被视为窗口内部高度的一部分(由于一些历史原因)

我们来验证一下，大家可以copy下面的代码试一下。
1. 直接缩小窗口，两个值会发生变化
2. 放大或缩小页面到，两个值会改变
如我的浏览器中，100%缩放时宽高是1440*789，放大页面到200%，宽高是720*394，刚好减小2倍，缩小页面到50%，宽高是2880*1578，刚好增大两倍。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>test window's inner Size</title>
    <style type="text/css">
        html,body {
            margin: 0;
            padding: 0;
        }
        .reference {
            box-sizing: border-box;
            width: 100px;
            height: 100px;
            background: gray;
        }
    </style>
</head>
<body>
    <div class="reference">
        100px
    </div>
</body>
<script type="text/javascript">
document.addEventListener("click", (e)=>{
    alert(`window.innerWidth:${window.innerWidth}\nwindow.innerHeight:${window.innerHeight}`)
})
</script>
</html>
```

#### 滚动偏移量(Scrolling offset)
`window.pageXOffset`和`window.pageYOffset`,包含了一个文档水平和竖直方向上的滚动偏移量，因此你可以知道用户滚动了多少。
{% asset_img desktop_page.jpg desktop_page %}

这个属性也是基于CSS像素测量的，你可以知道文档向左或向右移动了多少，无论缩放的状态是怎么样的。

理论上，如果用户向上滚动了文档，并进行了放大，那么`window.pageX/YOffset`将会改变。然而，当用户进行缩放时，浏览器会尝试保持页面的缩放的一致性，而保留之前顶部可视的相同的元素在依然在可视页面的顶部(简单解释就是缩放后保证可视区域之前顶部能看到的元素，现在还能看到)，这就会导致pageOffset这个属性不能很好的工作，意味着在实际环境中`window.pageX/YOffset`的值可能不会变化，已经滚出窗口外面的CSS像素基本上保持一致。

{% asset_img desktop_page_zoomed.jpg destop_page_zoomed %}

验证一下,大家可以copy我下面的例子测试一下
- 滚动后的偏移量
滚动后的偏移值正常，缩放完成后在滚动不会影响偏移值的大小。
- 滚动后在放大后偏移不变化
滚动到某个程度在缩放偏移值确实不变

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style type="text/css">
        html, body {
            margin: 0;
            padding: 0;
        }

        #row , #col{
            display: flex;
        }
        #col {
            flex-direction: column;
        }
        .box {
            box-sizing: border-box;
            width: 100px;
            height: 100px;
            min-width: 100px;
            min-height: 100px;
            border-bottom: 1px solid gray;   
            border-right: 1px solid gray;   
        }
    </style>
</head>
<body>
    <div id="row"></div>
    <div id="col"></div>
</body>
<script type="text/javascript">
let rowContainer = document.querySelector("#row")
let columnContainer = document.querySelector("#col")

function addBox(amount){
    let rowBoxes = ""
    let colBoxes = ""
    for(let i=0; i<amount; i++) {
        rowBoxes += `<div class="box">${i*100}px</div>`
        colBoxes += `<div class="box">${(i+1)*100}px</div>`
    }

    rowContainer.innerHTML = rowBoxes;
    columnContainer.innerHTML = colBoxes;
}
addBox(15)
document.addEventListener("click", (e)=>{
    alert(`window.pageXOffset:${window.pageXOffset}\nwindow.pageYOffset:${window.pageYOffset}`)
})
</script>
</html>
```

#### 概念：视口
在我们继续引入更多的js属性之前，我们不得不引入另一个概念：视口。
视口的功能就是用来约束`<html>`元素的，`html`元素是你站点最上层的包含块。

这个可能听起来让人迷惑，让我们来举一个实际的例子，假设你现在有一个流体布局，其中一个侧边栏的宽度是10%，现在，当你调整浏览器窗口大小时，侧边栏也会随之等比增大或减小，但实际上是如何工作的呢？

从技术上讲，当侧边栏要从它的父元素获取10%的宽度时会发生什么？当然是从`<body>`标签获取，但是实际上我们并没有给`<body>`指定宽度。所以现在问题变成了`<body>`的宽度是多少呢？

正常来讲，所有的块级元素都是获取它父元素宽度的100%(会有一些意外情况，但我们暂时忽略这些)，所以`<body>`的宽度应该和它的父元素一致，也就是`<html>`元素。

所以`<html>`元素的宽度是多少？它和浏览器的窗口一样宽，这就是为什么你定义的宽度为10%的侧边栏是占据你浏览器窗口宽度的10%，所有的web开发者都非常清楚这一点并使用了这个事实。

你可能不知道它在理论上是如何运作的，理论上，`<html>`元素的宽度是由视口的宽度来约束的，`<html>`元素占据视口宽度的100%。

反过来讲，视口完全可以视为浏览器窗口，它已经被定义成了这样，视口它不是HTML结构的一部分，所以它不受CSS的影响，在桌面浏览器上，它仅仅代表浏览器可视窗口的宽高而已。但是视口的概念在移动端的浏览器上要复杂的多。

##### 结论
视口的约束会造成一些奇怪的结果，你可以滚动到这个站点(https://www.quirksmode.org/mobile/viewports.html)顶部，尝试放大几倍，以便该站点的内容溢出浏览器的窗口。

现在滚动到右边，可以看到顶部的蓝色导航条已经不能很好的包裹它的内容了。
{% asset_img desktop_htmlbehaviour.jpg desktop_htmlbehaviour%}

这个行为说明了是视口定义的方式，我给了这个蓝条100%的宽度。100%代表了什么？它表示`<html>`这个元素，也就是视口的宽度，也是浏览器窗口的高度。

当我们使用100%s缩放时一切都是正常的，现在我们尝试放大，导致视口的宽高实际上是小于我们的所有内容宽度的。这本身没什么问题，现在我们的元素溢出了`<html>`元素，并且由于这个元素设置了`overflow: visible`,这意味着溢出的元素无论如何都会显示。

但是蓝色的导航条却不会溢出，由于我给定了它`width:100%`，最终，浏览器会遵循给定的视口宽度来定义蓝色导航条的宽度，而不会去在意这个宽度对于现在来讲是不是窄呢。
{% asset_img desktop_100percent.jpg desktop_100percent %}

##### 文档宽度(document width?)
如果我真的需要知道页面内容的总宽度是多少，包括那些溢出的部分，据我所知，还没有值能直接拿到。(除非你计算这个页面每个元素独立的宽度和边距，但是这很容易出错，恕我直言)

我开始相信我们需要一个javascript的属性能给出文档的宽度，我将它称之为"文档宽度"(document width),显然也是基于CSS像素测量的。

{% asset_img desktop_documentwidth.jpg desktop_documentwidth %}

如果我们觉得这个值不错，为什么不将这个值暴露给CSS呢？我希望我的蓝色导航条的宽度取决于文档的宽度，而不是`<html>`元素的宽度。(这肯定比较棘手，如果不能实现这个功能，我也不会感到惊讶)，浏览器厂商们，你们是怎么看的呢?

#### 测量视口(Measuring the view)
你可能想要知道一个视口的尺寸，他们可以通过`document.documentElement.clientWidth/Height`拿到。

{% asset_img desktop_client.jpg desktop_client %}

如果你熟悉文档对象模型，你应该知道`document.documentElement`实际上就是`<html>`元素，一个HTMl文档的根节点。但是，视口比`<html>`元素还要高一级，应该说，视口包含着`<html>`元素，所以你给`<html>`元素设置了宽度，是会有一定问题的。(我不推荐这么做，但这也许是一个办法)

比如下面的这种情况，`document.clientWidth/Height`将会给出的是视口的尺寸，而不是`<html>`元素的宽度。(这是一个特殊的规则仅仅对于这个元素的这个属性对，其他的状况下是元素使用的实际宽度)

{% asset_img desktop_client_smallpage.jpg desktop_client_smallpage %}

所以`document.documentElement.clientWidth/Height`也给出了视口的尺寸，无论`<html>`元素的尺寸如何。

验证一下：
给html一个固定宽高，验证`documentElement.clientWidth/Height`是给出的视口宽高。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style type="text/css">
        html, body, h2 {
            padding: 0;
            margin: 0;
        }
        html {
            width: 200px;
            height: 800px;
            border: 1px solid gray
        }

    </style>
</head>
<body>
    <h2>test</h2>
    <p class="msg">Lorem</p>
</body>
<script type="text/javascript">
    document.addEventListener("click",(e)=>{
        alert(`documentElement.clientWidth:${document.documentElement.clientWidth}\ndocumentElement.clientHeight:${document.documentElement.clientHeight}`)
    })
</script>
</html>
```

##### 两个属性对的关系(Two property pairs)
前面不是介绍过视口的尺寸可以由`window.innerWidth/Height`得到吗？嗯，是也不是。

这两个属性对是存在一些正式的区别的，`document.documentElement.clientWidth/Height`是不包含滚动条的大小的，但是`window.innerWidth/Height`是包含滚动条的，显然这点区别看不起来有点吹毛求疵呢。

真实的原因是这两个属性是浏览器战争的产物，在过去，网景(Netscape)只支持`window.innerWidth/Height`而IE只支持`document.documentElement.clientWidth/Height`,随后的浏览器对这两个属性同时支持。

在桌面浏览器上这两个的异同只是很小的一点干扰，但是这对移动端的浏览器却很有用，后面我们会讲到。

#### 测量<html>元素(Measuring the `<html>` element)
在任何情况下我们都可以通过`clientWidth/Height`获取视口的尺寸，但是我们如何取得html元素的尺寸呢？他们存放在`document.documentElement.offsetWidth/Height`中。

{% asset_img desktop_offset.jpg desktop_offset %}

这个属性可以让你把`<html>`元素当作块级元素访问，如果你设置了宽度，`offsetWidth`将会显示它。

{% asset_img desktop_offset_smallpage.jpg desktop_offset_smallpage %}

#### 事件坐标(Event coordinates)
接下来我们介绍事件坐标，当一个鼠标事件发生时，会有5个以上的属性值来告诉你事件确切发生的位置。我们只讨论其中比较重要的3个。
1. `pageX/Y`
    给出相对于`<html>`元素的坐标位置（CSS像素)
2. `clientX/Y`
    给出了相对于视口的坐标位置(CSS像素)
3. `screenX/Y`
    给出了相对于屏幕的坐标位置(设备像素)

- pageX/Y
{% asset_img desktop_pageXY.jpg desktop_pageXY %}
- clientX/Y
{% asset_img desktop_clientXY.jpg desktop_clientXY %}
- screenX/Y
{% asset_img desktop_screenXY.jpg desktop_screenXY %}

90%的情况下你会使用`pageX/Y`，因为通常我们只想知道与文档的相对位置，10%的情况下你可能会使用到`clientX/Y`，但是基本上你不会感兴趣相对屏幕位置的事件发生的坐标。

#### 媒体查询(Media queries)
最后，我们来聊一聊媒体查询，想法很简单，就是当页面的尺寸大于，等于，或小于某个确切尺寸时，我们可以定义使用一些定制的CSS样式。举个例子
```css
div.sidebar {
    width: 300px;
}

@media all and (max-width: 400px) {
    div.sidebar {
        width: 100px
    }
}
```
现在，这个侧边栏宽度是300px,只有当宽度小于400px时，侧边栏的宽度变成100px。
提一个问题：这个宽度是基于什么测量的？
这里有两个媒体查询相关的属性:`width/height`和`device-width/height`

1. `width/height`使用的值与`document.documentElement.clientWidth/Height`相同，基于CSS像素工作。
2. `device-width/height`使用的值与`screen.width/height`相同，基于设备像素工作。

{% asset_img desktop_mediaqueries.jpg desktop_mediaqueries %}

你应该使用哪一个？几乎不用想，选用`width/height`，web开发者对设备宽度是不关心的啊，我们只需要关注浏览器窗口的大小。
所以，忘掉`device-width`并使用`width`即可,接下来我们可以看到，在移动端这种情况更混乱。

#### 结论(Conclusion)
这篇文章我们总结了桌面浏览器的一些行为，在第二篇中我会介绍在移动端中相关的概念，并揭示一些与桌面端浏览器的不同之处。

> **tips:**
> 本文是一篇介绍浏览器viewport的译文，我觉得掌握这些知识对后续无论是pc端或mobile端的web开发工作会有很大的帮助，由于原文指向的中文翻译地址已经失效，故此在我的blog上在翻译一次。对于一些技术名词我会保留，以避免造成误解。个人能力有限，若翻译上有错误或不准确的地方，望大家斧正。[blog-source](https://github.com/llcat/blog-source)
> 原文: [A tale of two viewports(part one)](https://www.quirksmode.org/mobile/viewports.html)

