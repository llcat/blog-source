---
title: 探寻webpack构建后的入口文件
date: 2020-06-15 15:15:30
tags: webpack
categories: fe
---

#### 前言
webpack很强大, 但配置繁琐, 使用时常面对一堆配置项不知所措, 不了解这些配置背后的目的是什么, webpack打包后的入口文件到底做了什么, 今天我们来探寻一番。
#### 准备工作
新建一个npm工程并引入webpack相关依赖。
- package.json
```json
{
  "name": "demo2",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11"
  }
}
```
- 安装依赖
```sh
npm install --registry=https://registry/npm.taobao.org
```
- 新建文件`src/hello.js`和`src/index.js`
hello.js
```js
export function hello() {
    console.log('Hello, Wabpack');
}
export function exportButNoImport() {
    console.log("I'm a function export bu not import by other module")
}
function notExport() {
    console.log("I'm a function not export!!!")
}
```
index.js
```js
import { hello } from './hello';
function main() {
    hello();
}
main();
```
- 添加webpack配置文件
webpack.config.js
```js
const path = require('path')

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist')
    }
}
```

#### 查看打包文件
main.js:
```js
 (function(modules) { // webpackBootstrap
 	// The module cache
 	var installedModules = {};

 	// The require function
 	function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		// Flag the module as loaded
 		module.l = true;

 		// Return the exports of the module
 		return module.exports;
 	}


 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;

 	// expose the module cache
 	__webpack_require__.c = installedModules;

 	// define getter function for harmony exports
 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
 		}
 	};

 	// define __esModule on exports
 	__webpack_require__.r = function(exports) {
 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 		}
 		Object.defineProperty(exports, '__esModule', { value: true });
 	};

 	// create a fake namespace object
 	// mode & 1: value is a module id, require it
 	// mode & 2: merge all properties of value into the ns
 	// mode & 4: return value when already ns object
 	// mode & 8|1: behave like require
 	__webpack_require__.t = function(value, mode) {
 		if(mode & 1) value = __webpack_require__(value);
 		if(mode & 8) return value;
 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
 		var ns = Object.create(null);
 		__webpack_require__.r(ns);
 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
 		return ns;
 	};

 	// getDefaultExport function for compatibility with non-harmony modules
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};

 	// Object.prototype.hasOwnProperty.call
 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

 	// __webpack_public_path__
 	__webpack_require__.p = "";


 	// Load entry module and return exports
 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
 })
/************************************************************************/
 ({

/***/ "./src/hello.js":
/*!**********************!*\
  !*** ./src/hello.js ***!
  \**********************/
/*! exports provided: hello, exportButNoImport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hello\", function() { return hello; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"exportButNoImport\", function() { return exportButNoImport; });\nfunction hello() {\r\n    console.log('Hello, Wabpack');\r\n}\r\n\r\nfunction exportButNoImport() {\r\n    console.log(\"I'm a function export bu not import by other module\")\r\n}\r\n\r\nfunction notExport() {\r\n    console.log(\"I'm a function not export!!!\")\r\n}\n\n//# sourceURL=webpack:///./src/hello.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _hello__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hello */ \"./src/hello.js\");\n\r\n\r\nfunction main() {\r\n    Object(_hello__WEBPACK_IMPORTED_MODULE_0__[\"hello\"])();\r\n}\r\n\r\nmain();\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

 });
```
看起来比较繁琐, 我们先抽取一个大体的框架出来:
```js
(function(modules) { // webpackBootstrap
 	// The module cache
 	var installedModules = {};

 	// The require function
 	function __webpack_require__(moduleId) {
 	}

 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;
    // 将一些变量和方法定义到__webpack_require__上, 这里保留一个, 后面用到时在逐个分析
    // ..... 

 	// Load entry module and return exports
 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
 })
 ({
      "./src/hello.js": (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hello\", function() { return hello; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"exportButNoImport\", function() { return exportButNoImport; });\nfunction hello() {\r\n    console.log('Hello, Wabpack');\r\n}\r\n\r\nfunction exportButNoImport() {\r\n    console.log(\"I'm a function export bu not import by other module\")\r\n}\r\n\r\nfunction notExport() {\r\n    console.log(\"I'm a function not export!!!\")\r\n}\n\n//# sourceURL=webpack:///./src/hello.js?");
}),

"./src/index.js": (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _hello__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hello */ \"./src/hello.js\");\n\r\n\r\nfunction main() {\r\n    Object(_hello__WEBPACK_IMPORTED_MODULE_0__[\"hello\"])();\r\n}\r\n\r\nmain();\n\n//# sourceURL=webpack:///./src/index.js?");
})
 });
```
这样清理下源码后基本清晰了, 我们来梳理下步骤:
1. 一进来实际上是一个[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)立即执行函数表达式(Immediately Invoked Function Expresssion)
```js
(function (modules) {

})({ "src/hello.js": func1, "src/index.js": func2 });
```
2. 定义了一个`__webpack_require__(moduleId)`函数。
3. 返回`__webpack_require__(moduleId)`执行的结果, 此时的moduleId是我们默认的入口文件'src/index.js'

#### `__webpack_require__(moduleId)`函数干了什么。
```js
function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		// Flag the module as loaded
 		module.l = true;

 		// Return the exports of the module
 		return module.exports;
 	}
```
这里我们也梳理一遍流程, 实际上自带的注释已经很清楚的说明了。
1. 根据传入的moduleId, 检查已安装的模块(installedModules)中有没有该模块的执行结果。
2. 如果没有, 新建一个module, 并把它放入已安装的模块中。
3. 根据moduleId从modules中获取改module, 并执行它。从前面我们知道, 传入的module实际上是一个这样的函数, 我们使用call调用它`Function.。prototype.call(thisArgs, [arg1, arg2])`即是`modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);`
```js
function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    eval(```
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ 
    var _hello__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hello */ \"./src/hello.js\");
    function main() {   
        Object(_hello__WEBPACK_IMPORTED_MODULE_0__[\"hello\"])();
    }
    main();
    //# sourceURL=webpack:///./src/index.js?```);
}
```
4. 对应的我们接下来要执行eval
`__webpack_require__.r`干了什么？
```js
// define __esModule on exports
__webpack_require__.r = function(exports) {
    if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
};
```
`__webpack_require__.r`函数干了两件事：
(1)如果环境支持Symbol, 给`module.exports`定义了toString时的标志, Symbol.toStringTag是一个内置的Symbol, 在调用toString函数时会读取这个值, 如果你不设定, 返回默认的`Object`。
```js
let a = {};
Object.prototype.toString.call(a); // [object Object]
let b = {};
Object.defineProperty(b, Symbol.toStringTag, {value: 'Module'});
Object.prototype.toString.call(b); // [object Module]
```
(2)设定了一个__esModule属性为true

5. 通过__webpack_require__引入我们的另外一个module: hello.js文件
前面的步骤就不赘述呢, 直接看最后一步eval做了些啥
```js
function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    eval(```
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */
    __webpack_require__.d(__webpack_exports__, \"hello\", function() { return hello; });
    /* harmony export (binding) */
    __webpack_require__.d(__webpack_exports__, \"exportButNoImport\", function() { return exportButNoImport; });
    function hello() {
        console.log('Hello, Wabpack');
    }
    function exportButNoImport() {
        console.log(\"I'm a function export bu not import by other module\")
    }
    function notExport() {
        console.log(\"I'm a function not export!!!\")
    }
    //# sourceURL=webpack:///./src/hello.js?```);
}
```
`__webpack_require.r`前面我们已经讲过了, 我们看看新引入的一个函数`__webpack_require__.d`的作用是什么
```js
// define getter function for harmony exports
__webpack_require__.d = function(exports, name, getter) {
    if(!__webpack_require__.o(exports, name)) {
        Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
};

// Object.prototype.hasOwnProperty.call
__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
```
这样梳理下看其实也很清楚呢, `__webpack_require__.d`实际上给我们的`module.exports`定义了我们在源码中设定的要导出的函数, 可枚举不可以重新赋值的一个getter。这样只想完成后, `_hello__WEBPACK_IMPORTED_MODULE_0__`实际上得到的是下面这样的东西。
```js
{
    'hello': function () {
        return hello
    },
    'exportButNoImport': function () {
        return exportButNoImport
    }
}
```
6. 到这一步就结束呢, 在`_hello__WEBPACK_IMPORTED_MODULE_0__`获取到`hello`函数并执行
```js
 function main() {   
    Object(_hello__WEBPACK_IMPORTED_MODULE_0__["hello"])();
}
main();
```

#### 疑问?
1. 为什么转换后的代码要包裹在eval中执行, 目的是什么?
查阅资料得知, 包裹在eval中是webpack生成sourcemap的一种方式, 对应的还有好几种。可以依次试下, webpack的[`devtool`](https://webpack.js.org/configuration/devtool/#root)有非常多的选项。比如换一种生成source-map的方式打包, 就不会有eval呢
```js
// webpack.config.js
module.exports = {
    devtool: 'source-map'
}
```
参考: [阮一峰sourcemap](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)
[webpack中的sourcemap](https://www.cnblogs.com/axl234/p/6500534.html)
2. 在执行导入函数时, 特地使用`Object(func)()`的方式调用, 这样做的好处是什么?
针对这个问题, 没想明白原因, 不过使用`mode: production`是不存在这行代码的

#### commonjs在webpack中是如何被处理的?
