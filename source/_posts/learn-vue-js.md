---
title: vue.js笔记
date: 2018-08-23 22:25:30
tags:
  - vue.js
categories: front-end
---

#### Vue.JS Study Note
最近新的项目需要将原有的一个管理app替换为web app的形式以便于跨多个平台使用，在技术选型上我决定采用`vue.js+element ui+echarts.js`的方案去做。因此开一篇学习笔记用来整理和记录知识点。

<!--more-->

##### 1. Introduction

##### 2. 组件基础
- 基本示例
  组件时一个可复用的Vue实例，所以我们注册组件时传入的选项基本与`new Vue()`相同，除了如`el`这种根实例特有的选项。
  ```js
  Vue.component("counter-button",{
    data: function(){
      return {
        count:0
      }
    },
    template: '<button v-on:click="count++">you click me {{count}} times'
  })
  ```
  > 注意：组件的data应该是一个函数，这样每个组件可以独立维护一份返回对象的拷贝。
- 组件的注册
  1. 全局注册
  2. 局部注册
- props传值
  1. 静态的传值
  2. v-bind动态的传值
- 单个根元素
- 通过事件向父级组件发送消息
  通过`$emit("your-event")`可以向父组件传递一个自定应的消息，
  在父组件上，使用v-on:your-event就可以监听到这个消息并做出处理，同时，还支持向上传递值，只需调用时传参即可`$emit("your-event",0.1)`,在父组件上，我们可以通过`$event`拿到这个值。
  ```js
  Vue.component("blog-post",{
    props:["post"],
    template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button v-on:click="$emit('enlargeFont')">
        Enlarge text
      </button>
      <div v-html="post.content"></div>
    </div>
  `
  })
  new Vue({
    el: "#app",
    data: {
      posts: [
        {id:1,title:"apple",content:"apple is good"},
        {id:2,title:"banana",content:"banana is yellow"},
        {id:3,title:"orange",content:"orange is acid"}
      ],
      fontSize: 1
    }
  })
  ```
  ```html
  <div id="app">
    <blog-post v-for="post is posts"
               v-bind:post="post",
               v-on:enlargeFont="fontSize+0.1">
    </blog-post>
  </div>
  ```

##### h => h(App)是什么？
用vue-cli工具初始化的`main.js`中有这样一段代码
```javascript
new Vue({
  render: h => h(App)
}).$mount('#app')
```
看到这我其实是有疑问的, `h => h(App)`到底是指什么？那么查过官方文档后知道，在初始化一个Vue实例时，我们可以使用`render`函数渲染元素以代替template。Vue在调用render函数时会传入`createElement`这个函数做参数。那么实际上面的代码可以写成这样。

```javascript
new Vue({
  render: function(createElement) {
    createElement(App)
  }
})
// 简化为es箭头函数的写法就是这样
new Vue({
  render: createElement => createElement(App)
})
```
那么实际上`h`只是render函数参数名称的简写而已,你甚至可以写成`a`,`b`或任意的名字也可以。但是`h`这个简写实际上是有含义的，我查阅资料看到有人引用even you的解释如下。
>It comes from the term "hyperscript", which is commonly used in many virtual-dom implementations. "Hyperscript" itself stands for "script that generates HTML structures" because HTML is the acronym for "hyper-text markup language".
>"h"这个缩写来源于"hyperscript"这个术语，这个术语被广泛应用于许多的虚拟dom的实现中，由于HTML是超文本标记语言的首字母缩写，"hyperscript"一词表示"用来生成HTML结构的脚本"

##### @vue/cli 3.0生成的项目怎么使用sass?
vue-cli生成的项目默认是支持Sass,Less,Stylus等Css预处理器的，因为它默认在webpack.config.js中就默认配置了这些预处理器。我们在创建完工程后只需要安装预处理器和相关的loader即可。比如我要安装sass
```
npm install -D sass-loader node-sass
```
可是如果我们想给这些loader设置一些配置时我们应该怎么做呢？
我们应该在与`webpack.config.js`同级的目录下创建`vue.config.js`文件，并增加配置项。
比如我想在每个scss文件中自动导入包含常用变量的文件，这样省去手动import的过程。在`vue.config.js`中加入下面的内容。
```js
module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/styles/variables.scss";`
            }
        }
    }
}
```
> [参考文档](https://cli.vuejs.org/zh/guide/css.html#css-modules)

##### Vue工程怎么动态的使用本地图片。
在我们编写组件时，有时候需要在组件中加载一些本地的图片，那么如果我们写成工作目录下的相对路径并绑定到`<img :src="path">`时是不生效的。因为src的信息是在程序build完成后动态附加的，也就是我们在build应用时webpack根本就不会处理`<img>`标签引入的资源(因为压根就没有引入)。所以我们有两种解决方式。
- 手动import图片资源
```html
<template>
    <nav class="nav-container">
        <nav-item v-for="item in items" :imgSrc="item.imgSrc" :text="item.text" :key="item.id">
        </nav-item>
    </nav>
</template>

<script>
    import NavItem from './NavItem';
    import pimg from '@/assets/img/personal_info.png'
    export default {
        name: "NavBar",
        components: {
            NavItem,
        },
        data(){
            return {
                items: [
                    {
                        id: 1,
                        imgSrc: pimg,
                        text: "个人信息"
                    }
                ]
            }
        }
    }
</script>
```

- 使用require引入资源
注意require仅接收一串字符，不接受任何的变量。
```html
<template>
    <nav class="nav-container">
        <nav-item v-for="item in items" :imgSrc="item.imgSrc" :text="item.text" :key="item.id">
        </nav-item>
    </nav>
</template>

<script>
    import NavItem from './NavItem';
    export default {
        name: "NavBar",
        components: {
            NavItem,
        },
        data(){
            return {
                items: [
                    {
                        id: 1,
                        imgSrc: require('@/assets/img/personal_info.png'),
                        text: "个人信息"
                    }
                ]
            }
        }
    }
</script>
```