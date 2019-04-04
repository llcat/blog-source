---
title: 傻傻分不清的__proto__和prototype
date: 2019-04-01 08:17:40
tags: javascript
categories: front-end
---

#### 前言
我想大多数前端开发者一定为JS的原型概念困惑过，什么是原型链呀？什么是原型？JS中是怎样实现基于原型的继承的?__proto__是什么？prototype又是什么？别着急，接下来我们一步步的来学习这些东西。

<!-- more -->

#### JS中的继承方式
在我们的开发历程中，有两种较常见的组织代码的方式，面向过程和面向对象，面向过程的方式暂且不表，面向对象的方式我们有这样几个概念，抽象，封装，继承和多态。在一般的OOP开发语言中，我们可以使用`class`关键字来抽象出一些共享的属性和方法，但是在JS中，我们只有对象的概念，如果是这样的话，我们如何抽象出一些公用的方法和属性实现抽象呢？JS中提供了一种基于原型的继承方式来达到我们抽象，简化代码的目的。

#### 你分的清__proto__和prototype的区别吗?
- __proto__
在浏览器的执行环境中，任何一个对象都有一个__proto__的属性，但是这个并不是ecma的标准，只是几大浏览器默认支持的一个属性，所以我们在实际的生产环境中，我们要谨慎使用这个属性，这个属性是用于表示隐式原型链的(implicit prototype link)的，指向了构造函数的prototype这个对象。在ecma中有定义[[prototype]]这个隐藏属性, 在ES5之后，官方提供了一个正式的方法`Object.getPrototypeOf()`来访问这个属性。
```js
function Student(name, age){
    this.name = name;
    this.age = age;
}

let s = new Student("pino", 21)

s.__proto__ === Student.prototype // expect true

Object.getPrototypeOf(s) === s.__proto__ // expect true
```

- prototype
prototype是显式的原型属性(explicit prototype property)，这个属性是用来实现原型的继承和属性的共享的，在JS中，任何一个函数对象都有一个prototype的属性，它是一个对象，也就是我们基于的原型对象。

#### new 操作符做了什么

```js
// 1. 创建一个新对象
// 2. 将构造函数的作用域赋值给新对象, this指向了这个对象
// 3. 执行构造函数，为新对象增加属性
// 4. 返回新对象
// 以上面的Student为例
let s = {}
s.__proto__ = Student.prototype
Student.call(s)
```

#### 参考
> [__proto__与prototype的区别和关系](https://www.zhihu.com/question/34183746)
> [ECMA-262(5.1) 4.3.5 prototype](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.5)
> [ECMA-262(5.1) 4.2.1 Objects](http://www.ecma-international.org/ecma-262/5.1/#sec-4.2.1)

