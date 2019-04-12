---
title: 前端知识点集锦
date: 2019-02-18 14:58:09
tags: 
  - interview
categories: front-end
---

#### 前言
在开始这篇博文前，我想以提几个问题的方式来总结自己写这篇文章的目的和意义，方便整理清楚往下面写这篇文章的思路。

<!--more-->

1. 写这篇文章的起因是什么？为什么需要写这样一篇文章？
  起因是准备换工作，由于公司的业务场景及职位的界定，导致当前的这份工作涉及的领域比较多，很难在某一领域内专精和突破，本人自身希望的职业发展是能够在某个方向上完成纵向的深入后在进行横向的发展。我比较赞同观点是人的精力是有限的，追求面面俱到的结果往往是面面俱不到。所以我需要更换一份职业界定更明显的工作，那么结合自己之前所做的工作，我决定深耕前端领域。虽然在前端领域我已经有了很多的积累，但是，特定到某些比较小的知识点时，我发现自己是不能快速的给出解答的(典型的文档查阅工程师，但在自己记忆模棱两可时，查文档几乎是在最快的解决方案)，那么这样对于后续的笔面试必然是十分不利的，写这样一篇文章可以方便自己整理，归纳，复习。

2. 准备从什么方向入手？
  从个人的目的上来讲，我应该从两个方面入手，一个是短期内的知识点突破，即用来应对笔面试的问题，另一个方面是着重于自身技能的一个checklist,即假设为一个合格的前端开发工程师，有哪些技能和知识点是需要掌握或了解的。

3. 文章应该以怎样的形式呈现？
  应该是以问答的形式来编写，首先提出问题，然后做出解答。对于需要花费较大篇幅回答的问题，可以另开文章以便给出详细的解析，在问题下给出链接即可。

> 我准备参考github上的关于前端面试的几个开源项目，如有雷同，纯属copy
> - [FE Interview Question](https://github.com/h5bp/Front-end-Developer-Interview-Questions)
> - [The Answer of FE InterView Question](https://github.com/yangshun/front-end-interview-handbook)
> - [The Preparation Guide for FE InterView](https://github.com/Jobeir/front-end-interview-preparation-guide)
> - [The Modern JavaScript Tutorial](https://github.com/iliakan/javascript-tutorial-en)

#### ES6新特性

#### JS中有哪些数据类型
Number, Boolean, String, Null, Undefine, Object, Symbol

#### 前端模块化有那些规范
AMD, CMD, CommonJs, ES的module(import, export)

#### JS的异步加载有那几种方式

#### 说一下你了解的盒子模型
IE的怪异盒子模型, 标准盒子模型(content, padding, border, margin)

#### 你用过box-sizing属性吗
content-box, border-box

#### 说一下你用过的伪类

#### a标签几个伪类选择器

#### 你用过那些CSS选择器

#### 说一下CSS各个选择器的优先级

#### 怎么清除浮动？
[清除浮动的4种方式](https://juejin.im/post/59e7190bf265da4307025d91)
[CSS浮动和清除浮动](https://juejin.im/entry/580479b85bbb50005b7c5083)

#### 请使用正则表达式匹配一个身份证号码是否正确
[正则匹配身份证](https://juejin.im/post/5aa8d89af265da23866f9669)

#### em和rem单位的区别

#### 浏览器的事件机制
- 怎么实现点击页面任何一个位置，alert点击的标签名字？
这个实现其实很简单，主要是考察对浏览器事件机制的熟悉程度,
查阅文档可知，浏览器的事件分为三个阶段,Capturing -> At-Target -> Bubbling
默认的Event在构造时是设置bubbles属性为false的。
```js
document.addEventListener("click",(e)=>{alert(e.target.tagName)})
```

#### a标签的有那几个伪类？
`<a>`标签有下面4个伪类:
- `:link`
当有链接属性的时候显示(即`<a href="index.html"></a>`)。
- `:visited`
链接的地址被访问过时。
- `:hover`
鼠标移动到dom节点上时。
- `:active`
鼠标点击瞬间。

几个需要注意的地方：
- `link` and `visited`


