---
title: es6(class)
date: 2020-06-03 09:43:59
tags: js
categories: fe
---

#### class关键字
关于`class`的关键字引入es的过程,可以参考tc39提案[proposal-class-fields](https://github.com/tc39/proposal-class-fields), 当前已经有较多的转译器,浏览器,js开发环境实现了对class定义的支持。如果你还没有接触过class,这里有一篇介绍如何使用class的说明[MDN Doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

### class在js中具体表现为啥？
js中实际只存在原型继承, 通过原型链来表现继承关系, 我们实例化一个对象时实际上是执行了函数的构造调用, 并通过原型链将对象指向了该构造函数的原型对象(prototype)。新引入的class语法实际上是函数构造调用的语法糖。
- class定义的实际也是个函数, 只不过是个特殊的函数, 不允许普通的调用方式, 只允许构造调用。
```js
class Person {
    /*
        public fields, 如果浏览器不支持, 请放在constructor
        constructor() {
            this.name = 'pino';
            this.age = 27;
        }
    */
    name = 'pino';
    age = 27;
    description() {
        return `${this.name}'s age is ${this.age}`
    }
}

typeof Person // "function"
Person.__proto__ === Function.prototype // true
const p = new Person()
p.__proto__ === Person.prototype // true
Object.getPrototypeOf(p) === Person.prototype // true
Person(); // will throw an error

/* ----------------------------------------------- */
// 换成函数的写法
function Person() {
    this.name = 'pino';
    this.age = 27;
}

// 大家应该很熟悉,被所有实例共享的方法我们放在原型对象(prototype)上
Person.prototype.description = function () {
    return `${this.name}'s age is ${this.age}`
}

// 现在表现行为与class定义是一致的, 但是函数是可以正常调用的
Person(); // do nothing here, return undefined
```

#### `__proto__`和`prototype`
js基于原型的继承可以看看这篇文章[MDN Doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

- `__proto__`代表的是指向关系, `prototype`代表被指向的原型对象
`__proto__`是各浏览器厂商实现的默认属性, 用于访问原型对象, 并不是JS语言的标准定义, 在es2015前, JS标准中没有方法能通过`someObj.[[Prototype]]`这个定义访问到原型对象, 后面引入了`Objetct.getPrototypeOf`方法来访问一个实例的原型对象。

- `prototype`长啥样？
prototype大概长下面这样, 举个例子。
```js
function Square() {}
Square.prototype.area = 16;
let s = new Square()
s.width = 4;
console.log(s)
/**
s大概长这样(如果你在浏览器尝试的话)：
{
    width: 4,
    // __proto__指向了s的原型对象
    __proto__: {
        area: 16,
        constructor: f Square(),
        __proto__: Objetc.prototype
    }
}
*/
```
可以看到, 一个原型对象在你没有给他手动加属性时, 最少会有两个属性, 一个`constructor`指向原函数, 一个`[[Prototype]]`指向下一级的prototype对象。

- 原型链图解
这里我们现在还是使用一个简单的构造函数`Person`来描述, 这里我们更简化一点
```js
function Person() {
    this.name = 'pino'
}

// 验证下原型链最后指向null结束
let p = new Person();
p.__proto__.__proto__.__proto__  // null
p.__proto__.constructor === Person // true
p.__proto__.__proto__.constructor === Object // true
```
{% asset_img proto_chain.png proto_chain %}

- 不同的对象实例都是指向的同一个原型对象(prototype)吗?
是的, 不同的实例指向的都是同一个原型对象(prototype), 所以原型对象上的方法和属性是给所有实例共享的。
```js
function Person() {
    this.name = 'pino'
}
let p1 = new Person();
let p2 = new Person();
p1.__proto__ === p2.__proto__ // true
```

- 能通过实例对象修改原型对象上的属性吗？
大多数人肯定会回答不行, 会发生属性屏蔽, age会直接添加到p1实例上, 然而实际上这个得分好几种情况:
```js
function Person() {};
let p1 = new Person();
let p2 = new Person();
Person.prototype.age = 18;
```
`p1.age = 18`会出现的三种情况：
1. `[[Prototype]]`链上存在age属性, 且age属性未被定义为`{ writable: false }`时, 会直接在p1上添加一个age属性, 它是屏蔽属性。
```js
p1.age = 18;
/*
p1 will like this:
{
    age: 18,
    __proro__: {
        age: 27
    }
}
*/
```
2. `[[Prototype]]`链上存在age属性, 且age属性被定义为`{ writable: false }`时, 在严格模式下会报错, 否则会忽略该操作, 但不会发生屏蔽。
```js
// { writable: true }是默认选项
const descriptor = Object.getOwnPropertyDescriptor(Person.prototype, 'age');
/*
descriptor may like this:
{
    configurable: true,
    enumerable: true,
    value: 27,
    writable: true,
}
*/
Object.defineProperty(Person.prototype, 'age', {
    configurable: true,
    enumerable: true,
    value: 27,
    writable: false,
});

p1.age = 18;
p1.age // 27, 不会发生属性遮蔽, 所以p1上不会新增age属性
```

3. `[[Prototype]]`链上存在age属性, 且它定义了一个setter， 那么`p1.age=18`会直接调用这个setter, age不会添加到p1上, 即不会发生屏蔽。
```js
let ageVal = 27;
Object.defineProperty(Person.prototype, 'age', {
    get: function() {
        return ageVal;
    },
    set: function (val) {
        ageVal = val;
    },
    configurable: true
})

// 第二种方式将值存储在实例的内部属性上
Object.defineProperty(Person.prototype, 'age', {
    get: function() {
        return this._ageVal
    },
    set: function (val) {
        this._ageVal = val;
    },
    configurable: true
})

p1.age = 18;
p2.age // 18
// 如果你使用chrome, 在控制台输出p1时可能会在p1上看到age属性, 这是chrome显示的问题. 可以使用Object.getOwnPropertyNames验证下, 或者换用firefox测试。
Object.getOwnPropertyName(p1); // [] or ['_ageVal']
```
- new操作符是干什么的?
要搞懂new操作符是干嘛的, 我们要先理解函数的`prototype`这个属性是干嘛的, 我们还是以`Person`为例子讲下：
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.description = function () {
    console.log(`Hello, My name is ${this.name} and age is ${this.age}`)
}
let p1 = new Person('lisa', 22);
let p2 = new Person('koko', 18);
```
prototype是个对象, 但是他是一个特殊的表示某一类型的对象, 他持有某一类型对象共有的特征, 与传统的表示类型特征的抽象描述(class(抽象描述) --> Instance(实例化))不同。js中实例对象把共有的属性和方法全部交给了原型对象呢, 这实际上是另一种形式的抽象方式。这种方式非常轻量且灵活, 比如说我可以随时替换某个实例原型对象, 或者我不想让原型对象替我做简介, 实例自己在定义自己的简介方法也可以(属性遮蔽), 那么实例对象是如何跟原型对象关联起来的呢？就是我们在new构造调用函数时在对象内部定义了`[[Prototype]]`属性指向了原型对象。js在你调用`let p = new Person('lisa', 22)`后, 会在内存中创建一个空的对象, 并设置`p.[[Prototype]] = Person.prototype`, 最后将`this->p`执行函数`Person`。你可以这样理解, (PS: js引擎不是这样干的, 方便理解举的例子)
```js
let p = new Object();
p.[[Prototype]] = Person.prototype; // 伪码
Person.call(p, 'lisa', 22);
```
综上, new操作符其实主要帮我们做了两件事, 1. 建了一个对象实例。 2. 将对象实例和原型对象关联起来。
按照这个概念, 我们看看依靠js提供的能力, 我们能不能不使用`new`创建一个对象呢
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

function customNew(constructor, ...args) {
    let o = {};
    Object.setPrototypeOf(o, constructor.prototype); // you can use __proto__ in browser, not standard
    constructor.call(o, ...args);
    return o;
}

let p1 = customNew(Person, 'lisa', 22);
let p2 = new Person('lisa', 22);
// 在控制台看看p1, p2的区别吧
```

- extends
