---
title: learn-vue.js
date: 2018-08-23 22:25:30
tags:
  - front end
  - vue.js
---

#### Vue.JS Study Note
最近新的项目需要将原有的一个管理app替换为web app的形式以便于跨多个平台使用，在技术选型上我决定采用`vue.js+element ui+echarts.js`的方案去做。因此开一篇学习笔记用来整理和记录知识点。

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
- 
