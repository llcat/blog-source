---
title: 读Vue.js源码(core/observer)篇
date: 2020-05-27 10:10:55
tags: vue.js
categories: fe
---

#### 2020/06/02
1. js原型, new(函数的构造调用), class(es6)使用原型怎么实现的, __proto__及prototype原型对象
2. js中microTask和marcoTask的概念, 涉及到Vue处理watcher时的流程。
3. 理清Observer, Dep, Watcher三个类之间的关系

重点关注index.js, dep.js, watcher.js,schedule.js
- `index.js`

- `dep.js`
基于常见的观察者模式定义了一个被观察对象(observable), 持有一组订阅者, 及增加,移除,通知订阅者的方法。
- `watcher.js`
定义了一个观察者, 这里的观察者不局限于观察一个主题/被观察对象(observable), 它支持订阅多个主题。
- `schedule.js`
- `array.js`
劫持了Js数组的几个原生方法
插入/弹出: push, pop, shift, unshift, splice
排序/反转: sort, reverse

- `traverse.js`
