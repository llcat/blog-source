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
常见的有如let, const, 解构赋值，Promise, async/await, Proxy, Symbol,
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
:hover, :link, :visited, :active, :focus

#### 你用过那些CSS选择器
选择器大致上可以分为下面几类：
- 简单选择器
比如我们常见的元素选择器，类选择器，id选择器，用以匹配一个或多个元素。

- 属性选择器
通过属性或属性值匹配一个或多个元素。

- 伪类选择器
匹配处于某个特定状态的一个或多个元素。

- 伪元素
匹配处于相关位置的一个或多个元素，如每个段落的第一个字，或某个元素的第一个子元素或最后一个子元素。

- 组合器
用来组合使用我们的选择器，可以用于非常特定的选择。
组合器有下面这几种
  - 后代选择器
    eg：`A B`,匹配A节点下的B节点，即B是A的子元素或者B是A的子元素的子元素。
  - 子选择器
    eg: `A>B`匹配B元素，满足条件：B是A的直接字节点。
  - 相邻兄弟选择器
    eg: `A+B`,B是A的下一个兄弟节点，AB拥有相同的父节点，并且B紧跟在A后面。
  - 通用兄弟选择器
    eg: `A~B`,匹配B元素，满足B是A之后的任意一个兄弟节点(AB拥有相同的父节点，B在A之后，但B不一定紧挨着A)
    
- 多重选择器
用','隔开的多个选择器，可以将一组声明用于多个选择器的所有元素。

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
- `:link` and `:visited`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style type="text/css">
        a:link {
            color: rgb(34, 211, 63);
        }
        a:visited {
            color: rgba(255, 0, 0, 0.733);
        }
    </style>
    <title>Document</title>
</head>
<body>
    <!-- 无href,不会显示link和visited的样式 -->
    <a>no href</a>
    <br>

    <!-- 特例：href为""时会显示visited的样式 -->
    <a href="">href is ""</a><br>

    <!-- 
        没访问前都是link样式,访问过后是visited样式。
        chrome中是根据历史记录来确定是link还是visited样式的，
        所以刷新页面不会更改一个链接已访问过的事实，除非清空历史记录,
        否则对于已访问过的链接显示visited的样式，在其他的浏览器中这点可能不同(如edge),
        还有浏览器的隐私模式下等特例。
     -->
    <a href="http://llcat.tech">href is http://llcat.tech</a><br>
    <a href="#">href is #</a><br>
    <a href="#/">href is #/</a><br>
    <a href="#test">href is #test</a><br>
    <a href="/test/test.html">href is /test/test.html</a><br>

    <!-- 特殊：执行js不会记录到历史中，所以点击后不会显示visited,只显示link样式 -->
    <a href="javascript:alert(0)">href is javascript:alert(0)</a><br>
</body>
</html>
```

- `:hover`和`:active`
`:active`应该永远放在`:hover`后面，因为鼠标移动到某个元素上时并进行了点击操作时，会同时出发`:hover`和`:active`，但是`:active`是一瞬间的样式，所以如果在`:hover`后面则会被覆盖掉不显示。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style type="text/css">
        .hover-before-active:hover {
            background: rgb(34, 118, 214);
        }
        .hover-before-active:active {
            background: rgb(23, 170, 84);
        }
        .hover-after-active:active {
            background: rgb(23, 170, 84);
        }
        .hover-after-active:hover {
            background: rgb(34, 118, 214);
        }
    </style>
</head>
<body>
    <a href="#" class="hover-before-active">hover-before-active</a><br>
    <a href="#" class="hover-after-active">hover-after-active</a>
</body>
</html>
```

- `:hover`和`visited`
`:visited`应该放在`:hover`之前，因为如果`:hover`放在`:visited`之后，一个已访问过的标签永远不会显示`:hover`效果，它会被`:visited`覆盖。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style type="text/css">
        .hover-before-visited:hover {
            color: rgb(34, 118, 214);
        }
        .hover-before-visited:visited {
            color: rgb(23, 170, 84);
        }
        .hover-after-visited:visited {
            color: rgb(23, 170, 84);
        }
        .hover-after-visited:hover {
            color: rgb(34, 118, 214);
        }
    </style>
</head>
<body>
    <a href="#" class="hover-before-visited">hover-before-visited</a><br>
    <a href="#" class="hover-after-visited">hover-after-visited</a>
</body>
</html>
```

总结下：
如果我们需要设置`<a>`标签的伪类，需要避免`:hover`和`:active`的冲突以及`:hover`和`:visited`的冲突。那么我们可以给这三个伪类排个序就是visited < hover < active，最后在最前面加上link即可。按照联想记忆法可以记成这样，lv-ha(love -> hate)。

#### GET方法和POST方法的区别

#### 说一说Vue Router你有用到那些钩子函数。

#### 说一下Vue的生命周期

#### CSS中有那些居中方式

#### 考查`typeof`和`instanceof`的使用

#### 考察JS的异步执行机制(microtask和macrotask),常见的考察setTimeout(fn,0)和Promise
