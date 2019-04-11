---
title: less 概览
date: 2019-04-10 15:01:06
tags: less 
categories: translation
---

> 之前一直用的sass，最近写自己的小demo想用一下less,看到antd的组件样式也都是用less写的，有点兴趣，遂先过一遍官方的overview，翻译并学习下。这篇文章是Less官方文档的Overview的中文翻译，由于个人水平有限，如翻译上有任何问题，请大家帮忙斧正[blog-source](https://github.com/llcat/blog-source)

<!-- more -->

#### less 概览
Less(全称为精简的样式表-Leaner Style Sheets)是一个向后兼容CSS的拓展语言。由于Less跟CSS基本类似，所以非常容易学习它。Less仅仅是为CSS新增了一些便捷的功能。这也是你可以快速上手Less的原因之一。
- 查看Less语言更详细的特性介绍，请看[特性](http://lesscss.org/features/)

- 查看所有的Less内置的函数，请看[函数](http://lesscss.org/functions/)

- 查看详细的使用介绍，请看[使用Less.js](http://lesscss.org/usage/)

- 查看与Less相关的第三方工具，请看[工具](http://lesscss.org/tools/)

Less到底给CSS新增加了那些特性？接下来我们快速的学习一遍。

#### 变量(Variables)
这个无需解释你就能懂，看下面的例子
```less
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}
```

```css
#header {
  width: 10px;
  height: 20px;
}
```
[更多关于变量的介绍](http://lesscss.org/features/#variables-feature)

#### 混入(Mixins)
混入是将一个规则集中的所有属性包含到另外一个规则集中，假如说我们有下面的类：
```less
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```

接下来我们想要在另外一个规则集中使用这些属性，我们只需要写下我们想要的属性的类的名称即可，就像下面这样。
```less
#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```
那么在`.bordered`中所有的属性将会出现在`#menu a`和`.post a`中。(注意你还可以使用#ids这种id选择器混入)

[更多关于混入的介绍](http://lesscss.org/features/#mixins-feature)

#### 嵌套(Nesting)

Less允许我们使用嵌套来代替级联，或者与级联配合使用，假设我们有下面的CSS。

```css
#header {
  color: black;
}
#header .navigation {
  font-size: 12px;
}
#header .logo {
  width: 300px;
}
```

在Less中，我们可以这样写：
```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
```

可以看到上面的代码更简洁，并且模仿了你HTML代码的结构。

你还可以在嵌套中绑定伪类选择器，下面是一个经典的清除浮动的及技巧。(&代表了当前选择器的父类)

> 原文如下：
> You can also bundle pseudo-selectors with your mixins using this method. Here's the classic clearfix hack, rewritten as a mixin (& represents the current selector parent):
> 我没太理解这里跟混入(mixins)有什么关系

```less
.clearfix {
  display: block;
  zoom: 1;

  &:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
```
[更多关于父类选择器的介绍](http://lesscss.org/features/#parent-selectors-feature)

#### 嵌套的@规则和冒泡(Nested At-Rules and Bubbling)
@规则如`@media`和`@supports`都可以以同样的方式嵌套在选择器中使用。@规则相较于在规则集中保持位置不变的其他规则，会移动到最前面的位置，我们称之为冒泡。

```less
.component {
  width: 300px;
  @media (min-width: 768px) {
    width: 600px;
    @media  (min-resolution: 192dpi) {
      background-image: url(/img/retina2x.png);
    }
  }
  @media (min-width: 1280px) {
    width: 800px;
  }
}
```

输出：
```css
.component {
  width: 300px;
}
@media (min-width: 768px) {
  .component {
    width: 600px;
  }
}
@media (min-width: 768px) and (min-resolution: 192dpi) {
  .component {
    background-image: url(/img/retina2x.png);
  }
}
@media (min-width: 1280px) {
  .component {
    width: 800px;
  }
}
```

#### 操作符(Operations)
算术运算符`+, -, *, /`可以操作任何的数字，颜色，或变量，如果可能，数学运算将会考虑单位并在加法，减法，或比较大小前转换了数值。计算结果所用的单位是表达式最左边声明的单位。如果转换不可能或者没有意义，单位将会被忽略，比如一些不可能的转换，px到cm或者rad到%。

```less
// 数字会转换到同一单位在计算
@conversion-1: 5cm + 10mm; // 结果是 6cm
@conversion-2: 2 - 3cm - 5mm; // 结果是 -1.5cm

// 可能的转换
@incompatible-units: 2 + 5px - 3cm; // 结果是 4px

// 操作变量
@base: 5%;
@filler: @base * 2; // 结果是 10%
@other: @base + @filler; // 结果是 15%
```

乘法和出发不会对单位进行转换，很多情况下它没有意义，比如一个长度乘以一个长度，应该是面积的大小，但CSS是不支持指定面积的，所以Less会操作数字并给结果一个明确声明的单位。

```less
@base: 2cm * 3mm; // 结果是 6cm
```

你还可以对颜色做一些计算。

```less
@color: #224488 / 2; //结果是 #112244
background-color: #112244 + #111; // 结果是 #223355
```

你可以在查看更多[操作颜色的函数](http://lesscss.org/functions/#color-operations)

#### calc()

为了兼容CSS,`calc()`不会计算表达式，但是在内嵌的函数中不会计算变量。
```less
@var: 50vh/2;
width: calc(50% + (@var - 20px));  // 结果是 (50% + (25vh - 20px))
```

#### 替换字符串(Escaping)
替换字符串允许你使用任意的字符串来表示一个属性值或者变量的值，任何在~"anything"或者~'anything'中的字符串会无变化的额替换到指定的位置，除了[插值](http://lesscss.org/features/#variables-feature-variable-interpolation)操作外。
```less
@min768: ~"(min-width: 768px)";
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

结果是:
```less
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```

注意，在Less 3.5版本之后，我们可以简写为下面这样：
```less
@min768: (min-width: 768px);
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```
在3.5+的版本中，很多要求"quote-escaping"引用字符串的情况都可以不需要呢。

#### 函数(Functions)
我们提供了各种类型的函数，包括颜色转换，操作字符串，数学运算等，你可以查看文档中的[函数参考](http://lesscss.org/functions/)章节。
使用它们非常简单，如下面的例子使用百分比函数转换0.5为50%，为基准色增加了5%的饱和度，设置了背景颜色减轻25%，并将背景色旋转90度。

```less
@base: #f04615;
@width: 0.5;

.class {
  width: percentage(@width); // returns `50%`
  color: saturate(@base, 5%);
  background-color: spin(lighten(@base, 25%), 8);
}
```

查看[函数参考手册](http://lesscss.org/functions/)

#### 命名空间和访问器
(不要与[CSS的@namespace](https://www.w3.org/TR/css3-namespace/)和[命名空间选择器](https://www.w3.org/TR/selectors-3/#typenmsp)混淆呢)

有的时候，为了更方便的管理或者是提供封装，你想要将你的混入规则分组管理，在Less中我们可以非常容易的做到这一点，假设你想要打包某些混入规则到`#bundle`下方便复用和发布，你可以这样写：
```less
#bundle() {
  .button {
    display: block;
    border: 1px solid black;
    background-color: grey;
    &:hover {
      background-color: white;
    }
  }
  .tab { ... }
  .citation { ... }
}
```
现在我们想要混入类`.button`到我们的`#header a`中，我们可以这样做：
```less
#header a {
  color: orange;
  #bundle.button();  // 还可以写成这样 #bundle > .button
}
```

注意：你需要在你的命名空间名城后加`()`，eg:`#bundle()`。如果你不想你输出的CSS中包含`#bundle .tab`等选择器。

#### 字典(Maps)
在Less3.5后，你还可以混入和并从规则集取值。
```less
#colors() {
  primary: blue;
  secondary: green;
}

.button {
  color: #colors[primary];
  border: 1px solid #colors[secondary];
}
```

输出将会是这样：
```css
.button {
  color: blue;
  border: 1px solid green;
}
```
[查看Maps](http://lesscss.org/features/#maps-feature)

#### 定义域(Scope)
定义域和CSS非常类似，变量或者混入首先会在自己的包含块中查找，找不到才会去它的父级作用域中去找。

```less
@var: red;

#page {
  @var: white;
  #header {
    color: @var; //white
  }
}
```
和CSS的自定义属性一样，混入和变量定义不需要放在引用他们的行之前，所以下面的代码和上面的例子是一样的。

```less
@var: red;

#page {
  #header {
    color: @var; // white
  }
  @var: white;
}
```

[查看：懒加载-Lazy Loading](http://lesscss.org/features/#variables-feature-lazy-loading)

#### 注释(Comments)
块注释和行注释都被允许使用
```less
/* One heck of a block
 * style comment! */
@var: red;

// Get in line!
@var: white;
```

#### 导入
导入功能与你预期的一致，你可以导入`.less`文件，所有的变量都可以使用，可以选择是否声明`.less`扩展名。

```less
@import "library"; // library.less
@import "typo.css";
```
查看更多关于[导入](http://lesscss.org/features/#imports-feature)

