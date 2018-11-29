---
title: get started with react
date: 2018-11-29 10:54:35
tags: react.js
categories: translate
---

#### Getting Started with React

> **Tips:**
> 本文章是React官方推荐给初学者的一篇博文，涵盖了React核心的的知识点并将引导你如何使用React工作,在此翻译该篇博文以供大家共同学习。原文链接:[getting-started-with-react](https://www.taniarascia.com/getting-started-with-react/)推荐英语基础较好的同学直接阅读原文

我自从学习`JavaScript`开始就听过`React`的大名，但我大致浏览了下官方文档就把我吓到了，`HTML`和`JavaScript`混合的写在一起，我想这不是我们应该去避免的吗？那么`React`到底解决了什么问题？

在经过对`React`的失败尝试后，作为替换，我专注于原生的`JavaScript`学习并在专业环境中使用`JQuery`完成开发。但最终我还是决定掌握它，我开始明白为什么我想要用`React`来代替原生`Js`或`JQuery`.

我尝试去精炼我曾经学过的知识到一篇比较友善的介绍文章中并分享给你，跟着下面的介绍一步步学习吧。

<!--more-->

**先决条件**

在学习`React`前你需要具有一些基本的知识点，如果你之前从没有使用过`JavaScript`或者了解过`DOM`的知识，那么我建议你先去熟悉下下面这些知识后再来学习React

- 基础的了解[HTML&CSS](https://internetingishard.com/)
- 关于[JavaScript](https://www.digitalocean.com/community/tutorial_series/how-to-code-in-javascript)编程的基础知识
- 对[DOM](https://www.digitalocean.com/community/tutorial_series/understanding-the-dom-document-object-model)基础的理解
- 熟悉[ES6的语法和特性](https://www.taniarascia.com/es6-syntax-and-feature-overview/)
- 安装了[Node.js和npm](https://www.taniarascia.com/how-to-install-and-use-node-js-and-npm-mac-and-windows/)

**学习目标**
- 学习`React`必要的概念和相关的术语，比如：Babel,Webpack,JSX,components,props,state和lifecycle.
- 构建一个简单的React应用来演示上面提到的这些概念。

#### What is React？

- React是最流行的JavaScript库之一，在github已经有超过10w+的star呢
- React不是一个框架(不同于Angular,Angular显得更死板些)
- React是FaceBook贡献的开源项目
- React用于构建前端用户界面
- 在一个MVC应用中，React属于视图层(View Layer)

React中最重要的一点是你可以创建组件，看起来像是自定义的，可复用的HTML元素，支持快速有效的构建出用户界面，同时,通过使用`state`和`props`,React可以使数据的存储和处理更高效。

#### Set up and Installation

有几种方式可以安装React,我将会展示两种方法，你可以选择你喜欢的一种方式来工作。

##### 静态HTML文件中引入

第一种方法不是现在主流使用React的方式，我们在后面的实例中也不会选用这种方式，但如果你曾经使用过JQuery等库，那么你会对这种方式比较熟悉，也易于理解。至少没有让你一开始就直面不熟悉的Webpack,Babel和Node.js那么可怕。

让我们开始新建一个基本的`index.html`文件，在头部从CDN引入React,React DOM,Babel三个文件,并创建一个`div`节点并指定其id为`root`,最后创建一个`script`标签用来编写我们自己的代码。

```html
<!Doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Hello React!</title>
        <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
    </head>
    <body>
        <div id="root">

        </div>
        <script type="text/babel">
        </script>
    </body>
</html>
```
我是引用了最新稳定版本的库在我写这篇文章时。

- [React](https://reactjs.org/docs/react-api.html) React顶层API
- [React DOM](https://reactjs.org/docs/react-dom.html) DOM特定的方法
- [Babel](https://babeljs.io/) 一个JavaScript编译器，可以让我们在旧浏览器中使用ES6+的新特性

我们应用的入口点是依照惯例命名为`root`这个div元素，你可能还注意到了类型为`text/babel`的script标签，这是使用Babel强制要求的。

现在，让我们开始编写React应用的第一行代码，我们将会使用ES6的classes去创建一个React的组件。

```js
class App extends React.Component {

}
```

接下来，添加一个`render()`方法，这是一个类组件中唯一要求的方法，他是用来渲染一个DOM节点的。
```js
class App extends React.Component {
    render(){
        return (
            // ....
        )
    }
}
```
在`return`中，我们将会放置一个类似于简单的HTML元素的东西，注意，我们并不是返回一个字符串，所以在这个元素两边不要使用引号，这种写法叫做`JSX`，我们将在后面对他做进一步的学习。
```js
class App extends React.Component {
    render(){
        return (
            <h1>Hello React!</h1>
        )
    }
}
```
最后，我们使用React DOM提供的`render()`方法在`root`这个`div`节点中渲染我们的`App`这个类。
```js
ReactDOM.render(<App/>,document.getElementById('root'))
```

这是`index.html`中完整的代码
```html
<html>

<head>
    <meta charset="utf-8">

    <title>Hello React!</title>

    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
</head>

<body>

    <div id="root"></div>

    <script type="text/babel">
        class App extends React.Component { 
            render() { 
                return (
                    <h1>Hello world!</h1>
                ); 
            } 
        } 

        ReactDOM.render(<App />, document.getElementById('root'));
    </script>

</body>

</html>
```

现在如果你在浏览器中打开`index.html`,你就会看到`h1`这个标签被渲染在DOM中呢。

做到这一步你已经可以看到，使用React并不是那么的可怕，它仅仅是一个JavaScript的库并且我们可以载入到我们的HTML中，到此我们完成了演示的目的，解析来我们会使用另一种方式创建React应用-`Create React App`

##### Create React App

像我们上面在静态HTML页面中引入相应的JavaScript库文件的方式，对于后续的代码变更不是那么高效而且较难维护。

幸运的是，FaceBook为我们提供了[Create React App](https://github.com/facebook/create-react-app)工具，它会为我们预先配置你构建React App时需要的一切东西。它将会为我们创建一个开发用的server,使用Webpack去自动编译React,JSX和ES6,为CSS规则自动添加前缀，并使用ESLint来测试和警告代码中的错误。

安装`create-react-app`,只需要在你指定的工作路径下运行下面的指令即可，确保你的Node.js版本高于`5.2`

```sh
npx create-react-app react-tutorial
```
一旦你完成安装后，移动到你的最新创建的目录下并启动工程
```sh
cd react-tutorial
npm start
```
一旦你运行了上面的指令，你可以在浏览器输入`localhost:3000`看到你新的React应用。

如果你研究下项目结构，你会看到一个`/public`和`/src`文件夹，以及常见的`node_modules`,`.gitignore`,`README.md`和`package.json`等文件.

在`/public`中，最重要的文件是`index.html`，非常类似于我们之前创建的静态HTML文件，仅有一个`root`div节点，但是这次没有使用`script`引入js库文件，所有的React代码都放置在`/src`目录下。

我们可以看到这套开发环境会自动帮我们编译和更新我们的代码，你可以尝试修改`/src/App.js`
```js
Edit <code>src/App.js</code> and save to reload.
```
你可以尝试替换上面的内容为任何的文本，修改保存后，在`localhost:3000`重新编译并刷新为你修改后的界面。

接下来，我们删掉`/src`目录下的所有文件，我们会新建自己的一套模板文件，仅保留`index.js`和`index.css`.

对于`index.css`，我个人是将[Primitive CSS](https://taniarascia.github.io/primitive/css/main.css)中的内容拷贝过来呢，你可以使用Bootstrap或者任意的CSS框架，或者什么都不改，仅仅是我个人感觉这样做会更方便。

那么现在在`index.js`中，我们导入React,ReactDOM,和CSS文件

```js
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
```

让我们再次创建`App`组件，之前我们已经有了一个`<h1>`,现在我们添加一个带有类声明的div元素，你可以注意到我们使用了`className`来代替`class`，这是我们需要注意的第一个点，我们所写的JavaScript并不是HTML
```js
class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Hello, React!</h1>
            </div>
        )
    }
}
```

最后，我们跟之前一样将组件`<App />`渲染到root节点上
```js
ReactDOM.render(<App />, document.getElementById('root'))
```

下面是我们完整的`index.js`，这次我们直接引入了`Component`作为React的属性。所以我们可以不需要从`React.Component`继承呢

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css'

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Hello, React!</h1>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElemntById('root'));
```
这个时候你在返回`localhost:3000`窗口看看，你可以看到“Hello, React!”像我们之前的一样。到此，我们已经初步掌握了如何构建一个React应用。

##### React开发者工具
这里有一个插件叫React开发者工具，他可以帮助更轻松的使用React工作，下载[React DevTools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)或者任意的你想使用的浏览器。

#### JSX:JavaScript + XML
正如你之前看到的，我们已经在我们的React代码中使用了看起来HYTML样式的代码，但它不是HTML,他被称之为**JSX**,表示JavaScript XML.

有了JSX,我们就可以写类似HTML的代码，并且可以创建XML-like的标签，下面的JSX看起来像赋值给一个变量.
```js
const heading = <h1 className="site-heading">Hello, React!</h1> 
```

在我们编写React代码时，使用JSX并非是强制要求的，我们可以使用`createElement`方法，这个方法需要传入标签名称，一个包含属性的对象和一个子元素，可以渲染出相同的信息，下面的代码与我们使用JSX效果是一样的
```js
const heading = React.createElement(
    'h1',
    {className:'site-heading'},
    'Hello, React!'
)
```
JSX更近似于JavaScript而不是HTML,所以在编写代码时我们需要注意下面几点：

- 当你给元素添加CSS类时，使用`className`用来替换`class`，因为`class`在JavaScript中保留的关键字
- 属性和方法名在JSX中统一采用驼峰写法，比如`onclick`应该写成`onClick`.
- 自闭和的标签必须以`/`终结，比如`<img />`

JavaScript的表达式可以被使用花括号`{}`内嵌在JSX中使用，包括变量，函数和属性。
```js
const name = 'Tania'
const heading = <h1>Hello, {name}</h1>
```
JSX非常容易书写和理解相比于使用原生的Js创建和添加一堆元素来看，这也是非常多的人喜欢React的原因之一。

#### Components
到此为止，我们已经创建过一个`App`组件，在React中几乎所有的一切都是由组件组成的，组件分为*类型组件*(class components)和*函数组件*(simple components)

众多的React应用都有很多小的组件，并且所有的组件都被加载到主`App`组件中，每个组件可以拥有自己的文件，因此我们尝试来改变下我们的项目。

从`index.js`中去掉我们的App `class`，看起来像下面这样
```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'))
```

接下来我们创建一个新的文件叫`App.js`并在其中编写我们的组件
```js
import React, { Component } from 'react';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Hello, React</h1>
            </div>
        );
    }
}

export default App;
```

我们在此处导出组件`App`并在`index.js`中引入，把组件写到不同的文件中并不是强制的，但不这样做我们的应用会渐渐变得臃肿且不好管理。

##### 类组件
现在我们创建两一个组件，新建`Table.js`文件并写入下面的代码
```js
import React, {Component} from 'react';

class Table extends Component {
    render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Job</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Charlie</td>
                        <td>Janitor</td>
                    </tr>
                    <tr>
                        <td>Mac</td>
                        <td>Bouncer</td>
                    </tr>
                    <tr>
                        <td>Dee</td>
                        <td>Aspring actress</td>
                    </tr>
                    <tr>
                        <td>Dennis</td>
                        <td>Bartender</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default Table;
```

这样我们就创建了一个自定义的类组件，与常规的HTML元素不同的是我们可以复用我们的类组件，在`App.js`中，我们可以载入`Table`组件
```js
import Table from './Table'
```
然后在`render`函数中使用它即可
```js
return (
    <div className='container'>
        <Table />
    <div>
)
```
如果你在回到浏览器查看，你可以看到`Table`已经被载入呢。

现在我们知道了什么是一个自定义的类组件，我们可以多次复用这个组件，然而，现在的数据仍然是硬编码的，这让它在某些场景下不会太有用

##### 函数组件

React中另一种类型的组件是函数组件，他是一个函数，编写这种组件不需要使用`class`关键字，现在让我们的`Table`组件变成两个函数组件，一个`table header`和一个`table body`.

我们使用ES6的箭头函数去创建这些函数组件，首先是Table header:
```js
const TableHeader = () => {
    return (
        <thead>
            <tr>
                <th>Name</th>
                <th>Job</th>
            </tr>
        </thead>
    )
}
```
接着编写table body:
```js
const TableBody = () => {
    return (
        <tbody>
            <tr>
                <td>Charlie</td>
                <td>Janitor</td>
            </tr>
            <tr>
                <td>Mac</td>
                <td>Bouncer</td>
            </tr>
            <tr>
                <td>Dee</td>
                <td>Aspiring actress</td>
            </tr>
            <tr>
                <td>Dennis</td>
                <td>Bartender</td>
            </tr>
        </tbody>
    );
}
```
现在我们的`Table`类组件看起来像这样
```js
class Table extends Component {
    render() {
        return (
            <table>
                <TableHeader />
                <TableBody />
            </table>
        )
    }
}
```

一切表现的跟之前一样，正如你所看到的，组件可以被嵌套在其他组件中使用，函数组件和类组件也可以混用。

> 一个类组件必须包含`render()`函数，并且`return`可以只返回一个父元素

作为对照，让我们来看一下一个函数组件和类组件的区别

```js
const SimpleComponent = () => {
    return <div>Example</div>
}
```

```js
class ClassComponent extends Component {
    render() {
        return <div>Example</div>
    }
}
```
可以注意到如果`return`仅包含一行内容，可以不需要加括号。

#### Props
现在，我们有了一个很酷的`Table`组件，但是数据是硬编码的，React最大的好处之一就是我们可以很方便的处理数据，它使用`props`和`state`来实现，首先，我们来学习使用props来处理数据。

第一步，我们将`TableBody`内的数据列全部移除
```js
const TableBody = () => {
    return <tbody></tbody>
}
```

接下来将所有的数据放在一个数组对象中，就像我们从Json-based API拿到的数据一样，我们在render中创建这个数组
```js
class App extends Component {
    render() {
        const characters = [
            {
                'name': 'Charlie',
                'job': 'Janitor'
            },
            {
                'name': 'Mac',
                'job': 'Bouncer'
            },
            {
                'name': 'Dee',
                'job': 'Aspring actress'
            },
            {
                'name': 'Dennis',
                'job': 'Bartender'
            }
        ];
        return (
            <div className="container">
                <Table />
            </div>
        )
    }
}
```

然后，我们将数据通过属性(properties)传递到子组件中,我们可以给这个属性任意取一个名字，只要不是JavaScript的保留关键字，所以接下来我使用`characterData`,传递的数据就是我们刚才定义的`characters`数组，你需要用{}将变量包含起来以表明他是一个JavaScript表达式。

```js
return (
    <div className="container">
        <Table characterData={characters} />
    </div>
)
```
数据通过这种方式被传递到`Table`组件中，我们在这边就可以尝试访问数据呢
```js
class Table extends Component {
    const { characterData } = this.props;
    render() {
        return (
            <table>
                <TableHeader />
                <TableBody characterData={characterData} />
            </table>
        )
    }
}
```
如果你打开React开发者工具去检查下`Table`组件，你可以看到我们刚定义的数组在Props中，这个数据会存储在一个虚拟的DOM中，一种比较高效的方式将数据同步到真实的DOM节点上。

这些数据暂时还没渲染到真实DOM节点上，因此，在`Table`中，我们需要通过`this.props`访问所有的属性,当前我们只传入了一个属性characterData,我们可以通过`this.props.characterData`取到数据。

我更青睐于使用ES6的解包创建一个变量来获得`this.props.characterData`的数据。

```js
const { characterData } = this.props;
```

当数据通过props向下传递给`TableBody`时，我们的`TableBody`组件是暂时还没做处理的，现在我们对数据进行处理。
```js
const TableBody =  props => {
    const rows = props.characterData.map((row, index)=>{
        return (
            <tr key={index}>
                <td>{row.name}</td>
                <td>{row.job}</td>
            </tr>
        )
    })
    return <tbody>{rows}</tbody>
}
```
在回到浏览器可以看到数据已经被加载进来呢

你有可能注意到我给表格的每行都添加了一个`key`的索引，你永远都应该使用[keys](https://reactjs.org/docs/lists-and-keys.html#keys)当你在React中创建了一个列表时，这些可以用来帮助辨识每一个列表元素，你将会看到在我们想要操作变动列表元素时这是很有必要的。

Props用来传递已存在的数据到React组件中是一种很有效的方式，然而组件并不能改变props,它们是只读的，在下一个小节，我们会学习使用`state`在React应用中进一步的控制和处理数据。

#### State
现在，我们将`character`的数据都存放在一个数组中，并通过props来传递它，这是一个好的开始，但是想象一下如果我们想要从数组中删掉一个子项，使用Props,我们只拥有一个单向数据流，但是通过state我们可以在组件中更新这些数据。

你可以假想state为一些需要被保存和修改但是没有必要存储到数据库中的数据，比如：从你的购物车中添加或删除一些商品在你正式付款前。

我们首先来创建一个`state`对象
```js
class App extends Component {
    state = {};
}
```

这个对象中包含任何你想要保存的属性，对于我们的应用来说，就是`characters`数组。
```js
class App extends Component {
    state = {
        characters: [
            { 'name': 'Charlie'}
            // ... add other item here
        ]
    }
}
```

接下来我们想要移除一个`character`，需要在`App`类中创建一个`removeCharacter`方法。

如果我们要更新state,必须要使用内置的`this.setState()`方法来操作state,简单的使用`this.state.property`来赋值是不生效的，最后通过传入索引来过滤数组并返回新的数组

```js
removeCharacter = index => {
    const { characters } = this.state;
    this.setState({
        characters: characters.filter((character, i) => {
            return i !== index
        })
    })
}
```

`filter`方法并不会改变数组而是创建一个新的数组返回，这个方法会过滤掉所有不满足条件的元素。在这里也就是返回数组中所有的元素除了下标与`index`相等的元素。

现在我们传递这个函数到`Table`子组件中，并在表的每一列中渲染一个按钮可以调用这个函数
```js
return (
    <div className="container">
        <Table
            characterData={characters}
            removeCharacter={this.removeCharacter}
        />
    </div>
)
```

正如同我们之前从`Table`传递到`TableBody`中一样，我们再次通过props传递这个函数
```js
class Table extends Component {
    render() {
        const { characterData, removeCharacter } = this.props;

        return (
            <table>
                <TableHeader />
                <TableBody 
                    characterData={characterData} 
                    removeCharacter={removeCharacter} 
                />
            </table>
        );
    }
}
```
这里我们在`removeCharacter()`方法中定义索引的位置，在`TableBody`组件中，我们通过参数传递了索引值，所以filter函数知道那个子项需要被移除，我们新建一个按钮并设置一个`onClick`事件来完成函数的调用。
```js
<tr key={index}>
    <td>{row.name}</td>
    <td>{row.job}</td>
    <td><button onClick={()=>props.removeCharacter(index)}>Delete</button></td>
</tr>
```

> 为什么`onClick`中我们传入了一个箭头函数？因为你如果传入props.removeCharacter(index)会被认为是一个表达式而被自动执行

非常有意思，现在我们有了删除按钮，我们可以修改state中的数据通过删除一个character.通过这些，我想你应该懂了如何初始化一个state并对它做修改。

#### Submitting Form Data
现在我们已经将数据存放在state中了，并且可以从state中删除任意的子项，但是如果我们想要添加一些数据到state中呢？在真实的应用中，你可能会更喜欢以一个空的state开始，比如一个任务列表或者是一个购物车。

在我们开始前，先从`state.characters`中删除所有的硬编码数据，接下来我们使用表单来新增数据。
```js
class App extends Component {
    state = {
        characters: []
    }
}
```
接着我们新建一个`Form`组件在新的`Form.js`文件中，我们新建一个类组件，并增加一个我们之前没有使用过的构造函数`constructor()`,我们需要`constructor()`去使用`this`和接受父组件的props

我们设置了一个包含一些空属性的初始的状态对象，并将它赋值给`this.state`

```js
import React, { Component } from 'react'

class Form extends Component {
    constructor(props){
        super(props);

        this.initialState = {
            name: '',
            job: ''
        };

        this.state = this.initialState;
    }
}
```

我们的目标是一旦表单中的字段改变了就更新`Form`组件的state，当我们提交表单时，数据将会被传递到`App`的state并更新显示`Table`

第一步，我们建立一个函数用来处理输入的变化，`event`将会被传入，我们根据输入的内容重新设置`Form`组件的state.

```js
handleChange = event => {
    const {name, value} = event.target;

    this.setState({
        [name] : value
    })
}
```

在我们提交表单前在做一些其他的工作，在render中，我们先从state取到两个属性，并且指定输入框的`value`为对应的值，接下来我们在监听到`onChange`事件时运行`handleChange()`来处理输入。

```js
render() {
    const { name, job } = this.state; 

    return (
        <form>
            <label>Name</label>
            <input 
                type="text" 
                name="name" 
                value={name} 
                onChange={this.handleChange} />
            <label>Job</label>
            <input 
                type="text" 
                name="job" 
                value={job} 
                onChange={this.handleChange}/>
        </form>
    );
}

export default Form;
```

将`From`组件在`App`中引入并使用后，我们只剩下最后处理数据提交的步骤呢，在`App.js`中新增`handleSubmit`方法,我们在更新`this.state.characters`时使用了[ES6的展开语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
```js
handleSubmit = character => {
    this.setState({characters: [...this.state.characters, character]});
}
```
并且确保我们将这个函数作为书香传入到`Form`中
```js
<Form handleSubmit={this.handleSubmit} />
```
在`Form`组件中，我们新建一个`submitForm`的方法来调用这个函数，将`Form`的state对象作为`character`参数传入即可，最后，使用初始的state来清空表单。

给`Form`组件添加一个提交按钮，我们使用`onClick`事件来代替`onSubmit`因为我们并不是在使用一个标准的提交功能，这个点击事件会调用我们的`submitForm`函数。
```js
<input 
    type="button" 
    value="Submit" 
    onClick={this.submitForm} 
/>
```
这样，我们的一个小应用就完成呢，我们可以创建，增加，删除用户，并且表格中显示的数据与state中保持一致。

#### Pulling in API Data
在React中一个最常见的用法是从API中获取数据，如果你对API的概念不是很熟悉并且不知道如何使用它，那么我推荐你阅读下[How to Connect an API with JavaScript](https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/),这会带领你大致了解API的概念并学习如何在原生JavaScript中使用它。

作为一个小测试，我们新建一个`Api.js`文件，在里面创建一个新的`App`组件，并使用[Wikipedia Api](https://en.wikipedia.org/w/api.php)提供的接口做测试，我在此处使用了一个能搜索任意内容的[接口](https://en.wikipedia.org/w/api.php?action=opensearch&search=Math&format=json&origin=*),你可以点击这个链接看看返回的内容。

我们会使用[JavaScript内置的Fetch](https://www.taniarascia.com/how-to-use-the-javascript-fetch-api-to-get-json-data/)方法来获取数据并展示出来。

我不会在一行行的解释接下来的代码，我们已经学习了如何创建一个组件，渲染他并关联一个state数组，这段代码不同之处在于我们使用了React的生命周期函数`componentDidMount()`，生命周期是指在React中一系列方法调用的顺序，挂在意味着一个组件已经被插入到DOM中呢。

当我们拉取数据时，我想要在`componentDidMount`调用时进行操作，因为我希望在我们拿到数据前组件已经被渲染在DOM中，在下面的代码段中，你会看到如何从Wikipedia API中获取数据并展示在页面上。
```js
import React, { Component } from 'react'

class Api extends Component {

    state = {
        data:[]
    }
    
    componentDidMount() {
        const url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=Math&format=json&origin=*"
        fetch(url)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    data:result
                })
            })
    }

    render(){
        const { data } = this.state
        const result = []
        if(data.length>0){
            data[1].forEach((e,i)=>{
                let l = <li key={i}><a href={data[3][i]}>{e}</a><p>{data[2][i]}</p></li>
                result.push(l)
            })
        }
        return <div><h4>{data[0]}</h4><ul>{result}</ul></div>
    }
}

export default Api;
```

