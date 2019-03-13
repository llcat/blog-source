---
title: 关于前端数据绑定
date: 2018-11-19 08:43:10
tags:
  - vue.js
  - data-binding
categories: front-end
---

#### 关于模板语法{% raw %}{{}}{% endraw %}
如果大家曾经使用过Vue.js，那么在起步的教程中就有教大家如何使用模板语法来将数据渲染到dom中，类似下面的代码段：
```html
<div id="app">
    <p>{{message}}</p>
</div>

<script>
    var app = new Vue({
        el:"#app",
        data:{
            message:"Hello,Vue"
        }
    })
<script>
```
如果让你来实现{% raw %}{{}}{% endraw %}这种模板语法，你有什么好的idea吗？最主要的一点就是将外部数据的变化与dom节点上渲染的数据相关联起来，
<!--more-->
#### 简单的实现
我们先只考虑非常简单的实现，就是将数据替换到我们的模板中。外部的数据与文本节点上的需要渲染的值依靠键值关联起来即可。如下图：

{% asset_img data-binding.PNG data-binding %}

简单来说，就是我们有两个对象，一个外部的`data`对象，一个内部的`bindings`对象，`bindings`对象持有与data对象键值关联的dom元素。`data`对象通过某种方式与`bindings`关联起来。

我们可以根据这样的工作流程来：以下面的`html`文档为例：
```html
<!Doctype html>
<html>
    <body>
        <div id="app">
            <p>{{msg1}}</p>
            <p>{{msg1}}</p>
            <p>{{msg1}}</p>
            <p>{{msg2}}</p>
            <p>{{msg3}}</p>
        </div>
    <body>
<html>
```
1. 通过正则表达式替换需要进行模板渲染的`<p>`节点成为我们能查找到的样式，即给他添加一个键值相关的自定义属性。
2. bind过程：通过`dom api`查找到上一步与键值相关的节点，并使用`Object.defineProperty()`方法重新定义赋值过程，这个过程中可以同时将相关联的`dom`节点进行更新。

#### 代码实现
结合上面的分析，我们知道了大体的方向，下面我们进行编码，如下：
```js
function Element(id, initData){
    var bindingMark = "data-element-binding"
    var self = this,
        el = document.getElementById(id),
        bindings = {},
        data = self.data = {},
        content = el.innerHTML.replace(/<(.*)>\{\{(.*)\}\}<\/(.*)>/g, markToken)
    // 替换p节点为带bindingMark标记的节点
    el.innerHTML = content
    for(var variable in bindings){
        bind(variable)
    }
    if(initData){
        for(var variable in initData){
            data[variable] = initData[variable]
        }
    }
    function markToken(match,front,variable,end){
        bindings[variable] = {}
        return `<${front} ${bindingMark}="${variable}"></${end}>`
    }

    function bind(variable){
        // 关联对应的dom节点
        bingdings[variable].els = el.querySelectorAll(`[${bindingMark}=${variable}]`);
        [].forEach.call(bindings[variable].els, function(e){
            e.removeAttribute(bindingMark)
        })
        // 关联data与bindings中对应的dom节点
        Object.defineProperty(data,variable,{
            set:function(newVal){
                [].forEach.call(bindings[variable].els, function(e){
                    bindings[variable].value = e.textContent = newVal
                })
            },
            get:function(){
                return bindings[variable].value
            }
        })
    }
}

var app = new Element("app", {
    msg1:"hello",
    msg2:"data",
    msg3:"binding~"
})
```

那么上面的代码主要是做了两件事：
- 将`<p>{{msg1}}</p>`替换为`<p data-element-binding="msg1"></p>`
- 根据上面的自定义属性查询到关联的dom元素，并关联到对应的键值上，使用`Object.defineProperty()`重新定义了`data`对象的set和get属性，从而在更新值时可以同时更新文本节点。

> 到此,我们就实现了一个简单的使用模板进行数据绑定，本文的示例代码是基于Vue.js源码做了部分修改，参见commit:`871ed91`，有兴趣的同学可以check到这笔提交看看。

