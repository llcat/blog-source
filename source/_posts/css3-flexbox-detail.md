---
title: css3弹性盒子详解
date: 2018-04-19 11:14:44
tags:
  - flexbox
categories: css3
---

#### 前言
由于前段时间在接触微信小程序后，看到官方文档中推荐使用flex box进行布局，经过查阅mdn文档和实际使用后，对flex box有了一定的概念。现对flex box的概念做总结和梳理。

- 什么是弹性盒子？
- 使用弹性盒子布局能够带给我们什么好处？
- 什么场景下我们可以使用弹性盒子？

一开始在接触到弹性盒子布局时，我内心是带着上面这些疑问的，不同于android提供给我们各种类型的layout(eg: LinearLayout, RelativeLayout, FrameLayout, ConstraintLayout...)，在之前的web前端页面的开发中，以我有限的css开发经验，基本上是基于文档流(行级元素和块级元素)并结合float及position属性来完成节点的布局，暂且不说这种方式的好坏，十几年来我们一直也是这样做的，css同样提供了新的布局方式供我们使用，也就是我们今天要说的主角-弹性盒子（Flex Box)。
<!--more-->
> **推荐阅读文档**
> - [MDN CSS Introduction](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Introduction_to_CSS) - 如果你对CSS不熟可以先看看这里
> - [CSS Flex Box](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Flexbox) - 弹性盒子介绍
> - [CSS Flexible Box Layout](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout) - 弹性盒子布局

#### 基本概念
Flex Box是一种一维的布局模型，之所以这么说是因为它一次只处理一个维度上的布局，一行或一列，在开始前我想先请大家记住下面几个概念，这几个概念是构建弹性盒子模型的基础。

- 主轴(main axis)
  主轴的方向由flex-direction决定
- 交叉轴(cross axis)
  垂直于你选择的主轴方向
- 弹性容器(flex container)
  包含弹性项目的父级元素，通过定义display:flex or display:inline-flex来指定弹性容器
- 弹性项目(flex item)
  弹性容器中的每个子元素都是弹性项目，弹性容器中的文本将被包裹为匿名弹性单元。

我们通过下面这张图来了解flex box的基本概念。
tips:copy from mdn
{% asset_img flexbox.png flexbox %}

##### 主轴
主轴的方向由flex-direction决定，可以取4个值：

- flex-direction: row
- flex-direction: row-reverse
- flex-direction: column
- flex-direction: column-reverse

我们下面通过一个例子来看看这4个值分别是怎么工作的
[flex-direction demo](https://github.com/llcat/front_end_practice/blob/master/Css/flexo-demo/flex_direction_demo.html) 

{% asset_img flex-direction01.png flex-direction:row and row-reverse %}

{% asset_img flex-direction02.png flex-direction:column and column-reverse %}

##### 交叉轴
交叉轴的方向是垂直于主轴方向的，如果主轴方向设置为行方向(inline),则交叉轴方向为列方向(block),反之亦然。

理解两个轴的概念又助于我们接下来学习各个属性的使用

##### Flex元素的默认行为
当我们定义了一个flex容器后，容器中的所有直系子元素都会变成一个flex元素，所有的css属性都会有一个初始值，所以flex容器中的flex元素都会有以下默认行为。
- 元素列为一行(flex-direction初始值为row)
- 元素从主轴的起始线开始排列
- 元素不会在主轴方向上拉伸，但是可以缩小
- 元素被拉伸来填充交叉轴
- flex-basis 属性为auto
- flex-wrap 属性为 nowrap

这样你的元素会呈线性排列，元素的大小即为主轴方向上的大小，如果有太多元素超出容器，他们会溢出不会换行，如果某个元素较高，其他元素也会被沿交叉轴方向拉伸,详见见[flex item default action](https://github.com/llcat/front_end_practice/blob/master/Css/flexo-demo/flex_items_default_action.html)

{% asset_img flex-items-default-action.png flex-items-default-action %}

##### CSS属性参考

- 应用于flex容器

属性名称|属性概括|初始值
:-:|:-:|:-:
[flex-direction](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-direction)|指定容器主轴方向|row
[flex-wrap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-wrap)|指定容器是单行显示<br>还是多行显示|nowrap
[flex-flow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-flow)|flex-driection和<br>flex-wrap的简写|row nowrap
[justify-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content)|定义了浏览器如何分配顺着<br>父容器主轴的弹性元素之间<br>及其周围的空间|normal
[align-items](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items)|以与justify-content相同的方式<br>在交叉轴方向上将当前行上的<br>弹性元素对齐。与align-content属性的<br>区别在于它指定了当前Flex容器的**行中的<br>项目**的对齐方式，而align-content<br>则指定了**行自身**的对齐方式|stretch
[align-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-content)|指定了在交叉轴方向对容器中的<br>每一行的空间上的分配，所以<br>该属性只对多行弹性容器起作用，对单行弹性容器无效|stretch

- 应用于flex子项

属性名称|属性概括|初始值
:-:|:-:|:-:
[flex-grow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-grow)|定义弹性盒子子项的拉伸因子|0
[flex-shrink](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-shrink)|属性指定了flex子项的收缩规则。<br>flex子项仅在默认宽度之和大于容器的时候才会<br>发生收缩，其收缩的大小是依据 flex-shrink 的值|1
[flex-basis]()|指定了flex子项在主轴方向上的初始大小。<br>如果不使用 box-sizing 来改变盒模型的话，<br>那么这个属性就决定了flex子项的内容盒（content-box）的宽或者高（取决于主轴的方向）|auto
[flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)|简写属性，可以同时设置flex-grow, flex-shrink与flex-basis|0 1 auto
[align-self](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-self)|对齐当前flex行中的flex子项，并覆盖align-items的值. 如果任何flex子项的交叉方向margin值设置为auto，则会忽略align-self|auto
[order](https://developer.mozilla.org/zh-CN/docs/Web/CSS/order)| 属性规定了弹性容器中的可伸缩项目在布局时的顺序。<br>元素按照 order 属性的值的增序进行布局。<br>拥有相同 order 属性值的元素按照它们<br>在源代码中出现的顺序进行布局。|0

> 当前用于定义flex box的css属性就是上面列举的这些，大家可以根据这些属性是应用于容器还是子项元素来分类记忆。下面我会根据每个属性来写一个demo来进一步掌握弹性盒子的使用。

#### Flex Box属性demo

*(1)flex-wrap*
*(2)flex-flow*
*(3)justify-content*
*(4)align-items*
*(5)align-content*
*(6)flex-grow*
*(7)flex-shrink*
*(8)flex-basis*
*(9)flex*
*(10)align-self*
*(11)order*