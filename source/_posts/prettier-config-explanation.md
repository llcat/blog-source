---
title: prettier配置项说明
date: 2020-08-19 15:00:29
tags: fe
categories: fe
---

#### prettier配置说明
prettier是前端工程常用的代码格式化工具, 如果你对如何配置prettier有疑问, 这里开个小demo, 逐一介绍下每个配置项的作用。

<!-- more  -->

#### 初始化工程
随便创建一个工程文件夹, 初始化`package.json`, 并添加`prettier`依赖
```shell
mkdir prettier_demo
cd prettier_demo
yarn init -y
yarn add prettier -D
```

> 项目根目录下添加一个`.npmrc`文件, 加入下面的配置, 更换了registry地址(可选)
  ```
  registry=https://registry.npm.taobao.org
  ```

#### 编写配置文件
`prettier`支持多种格式的配置文件, 这里我们选取了js格式的配置文件,方便编写注释,在项目根目录下创建一个`.prettierrc.js`文件, 你也可以选择其他合法合适的配置文件, 请参考[Configuration File](https://prettier.io/docs/en/configuration.html)
```js
module.exports = {
  // global
  trailingComma: "es5",
  tabWidth: 4,
  semi: false,
  singleQuote: true,
};
```