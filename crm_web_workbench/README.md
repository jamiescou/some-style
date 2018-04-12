# 项目介绍

项目使用 react,react-router,redux,immutable.js,bebel,webpack,koa。
app 前端代码
server 负责后端渲染部分
ui 公共组件
ui-doc 预览 ui 组件的效果
utils 各个应用(app) 能够公用到的东西
webpack 项目构建相关

# crm 前端发布流程

* 代码合进 master 分支
* 登录跳板机
* cd /data/apps/crm_web_workbench
* git pull origin master
* 如果需要安装依赖就安装依赖 nam install <new package>
* nam run package
注意这里请填写你自己的名字！
* robocop -u <-yourname-> -l crm_nginx_servers -t static --skip
* 登录机器依次重启，http://wiki.meiqia.com/pages/viewpage.action?pageId=13862635

等待任务完成后测试

# how to run
 
    npm install
    npm run dev

本地开发启动 localhost:8332
app 目录和 server 目录下对应的代码有修改都会分别对浏览器和后端 server 做 hot reload

# package

    npm run package

# 开发指南

项目中配置了 eslint，开发过程中可以启动 gulp lintWatch 来监听文件改动实时 lint，也可以单独执行 gulp lint 。
请确保代码提交前所有 lint 已经通过

## 项目目录结构

### app 项目前端资源
* components 页面组件按照模块来分
* redux action 和 store 部分
* routes 路由部分
* styles 样式部分
* utils 一些通用方法和模块

### config 配置文件
* apiconfig 后端请求地址

### gulp

### server 后端渲染部分

### utils

### webpack

## 快速开发一个前端模块

SFA 产品模块化，这里简单列一下快速开发一个模块前端需要新增的地方
以 opportunity 模块为例:
* 页面组件放在：app/components/opportunity/
* redux 部分： app/redux/reducers/opportunity/
* actionTypes： app/redux/action-types/opportunity.js
* 路由部分： app/route/opportunity/
* 样式部分： app/styles/modules/opportunity/

# Code Guide
##### 命名

* 文件命名规则：英文单词，多单词使用“-”连接。

例如：

    task-bg.jpg
    title-bg.png
    project-task.css
    project-ctrl.js
    projectCtrl.js


##### 缩进
* 用四个空格来代替制表符（tab）,嵌套元素应当缩进一次（即四个空格），大部分人习惯JS为4个空格的缩进，让HTML，CSS和JS保持一致，webstorm默认的代码格式化就可以达到四个空格的缩进，快捷键Ctrl+Alt+L

##### HTML
* 嵌套的节点应该缩进
* 在属性上，使用双引号，不要使用单引号
* 属性名全小写，用中划线做分隔符
* 不要在自动闭合标签结尾处使用斜线（HTML5 规范 指出他们是可选的）
* 不要忽略可选的关闭标签，例如：`</li>` 和 `</body>`

##### HTML5 doctype
* `<!DOCTYPE html>` 在页面开头使用这个简单地doctype来启用标准模式，使其在每个浏览器中尽可能一致的展现；
* 虽然doctype不区分大小写，但是按照惯例，doctype大写

##### 字符编码
* `<meta charset="UTF-8">`

##### IE兼容模式
* `<meta http-equiv="X-UA-Compatible" content="IE=Edge">`

##### JavaScript
* 变量声明, 表达式, return, throw, break, continue, do-while 后需要加分号
* 文件最后保留一个空行
* 换行的地方，行末必须有','或者运算符
* `单行注释`：双斜线后，必须跟一个空格。可位于一个代码行的末尾，与代码间隔一个空格
* `多行注释`：最少三行, '*'后跟一个空格
* 最外层统一使用`单引号`
* 标准变量采用驼峰式命名
* 常量全大写，用下划线连接
* 无论是函数声明还是函数表达式，'('前不要空格，但'{'前一定要有空格
* 对象属性名不需要加引号；对象以缩进的形式书写，不要写在一行；数组、对象最后不要有逗号
* 下列关键字后必须有`大括号`（即使代码块的内容只有一行）：if, else, for, while, do, switch, try, catch, finally, with
* 用'===', '!=='代替'==', '!='

# react 编码规范

- [基本规则](#%E5%9F%BA%E6%9C%AC%E8%A7%84%E5%88%99)
- [命名](#%E5%91%BD%E5%90%8D)
- [声明](#%E5%A3%B0%E6%98%8E)
- [对齐](#%E5%AF%B9%E9%BD%90)
- [引号](#%E5%BC%95%E5%8F%B7)
- [空格](#%E7%A9%BA%E6%A0%BC)
- [属性](#%E5%B1%9E%E6%80%A7)
- [括号](#%E6%8B%AC%E5%8F%B7)
- [标签](#%E6%A0%87%E7%AD%BE)
- [方法](#%E6%96%B9%E6%B3%95)
- [顺序](#%E9%A1%BA%E5%BA%8F)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

##基本规则

* 每个文件只包含一个 React 组件
* 使用 `JSX` 语法
* 除非是从一个非 `JSX` 文件中初始化 app，否则不要使用 `React.createElement`

**Class vs React.createClass**

* 除非有更好的理由使用混淆(mixins)，否则就使用组件类继承 `React.Component`。eslint 规则：[react/prefer-es6-class](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md)

```
// bad
const Listing = React.createClass({
  render() {
    return <div />;
  }
});

// good
class Listing extends React.Component {
  render() {
    return <div />;
  }
}
```

##命名

* **扩展名:** 使用 `jsx` 作为 React 组件的扩展名
* **文件名:** 英文单词，多单词使用“-”连接，如：`reservation-card.jsx`
* **引用名:** 帕斯卡方法，如：`ReservationCard`

```
// bad
const reservationCard = require('./reservation-card');

// good
const ReservationCard = require('./ReservationCard');

// bad
const ReservationItem = <ReservationCard />;

// good
const reservationItem = <ReservationCard />;
```
* **组件命名:**  使用文件名作为组件名。例如：`reservation-card.jsx` 组件的引用名应该是 `ReservationCard`。然而，对于一个目录的根组件，应该使用 `index.jsx` 作为文件名，使用目录名作为组件名。

```
// bad
const Footer = require('./footer/footer.jsx')

// bad
const Footer = require('./footer/index.jsx')

// good
const Footer = require('./Footer')
```

##声明

* 不要通过 `displayName` 来命名组件，通过引用来命名组件

```
// bad
export default React.createClass({
  displayName: 'ReservationCard',
  // stuff goes here
});

// good
export default class ReservationCard extends React.Component {
}
```

##对齐

* 对于 `JSX` 语法，遵循下面的对齐风格。eslint rules:  [react/jsx-closing-bracket-location](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md)

```
// bad
  <Foo
    superLongParam="bar"
    anotherSuperLongParam="baz"
  />

  // good
  <Foo
    superLongParam="bar"
    anotherSuperLongParam="baz" />

  // if props fit in one line then keep it on the same line
  <Foo bar="bar" />

  // children get indented normally
  <Foo
    superLongParam="bar"
    anotherSuperLongParam="baz" >
    <Spazz />
  </Foo>
```

##引号

* 对于 `JSX` 使用双引号，对其它所有 JS 属性使用单引号

>为什么？因为 JSX 属性[不能包含被转移的引号](http://eslint.org/docs/rules/jsx-quotes)，并且双引号使得如 `"don't"` 一样的连接词很容易被输入。常规的 HTML 属性也应该使用双引号而不是单引号，JSX 属性反映了这个约定。

eslint rules: [jsx-quotes](http://eslint.org/docs/rules/jsx-quotes)

```
 // bad
  <Foo bar='bar' />

  // good
  <Foo bar="bar" />

  // bad
  <Foo style={{ left: "20px" }} />

  // good
  <Foo style={{ left: '20px' }} />
```

##空格

* 在自闭和标签之前留一个空格

```
// bad
<Foo/>

// very bad
<Foo                 />

// bad
<Foo
 />

// good
<Foo />
```

##属性

* 属性名采用驼峰式命名法

```
// bad
<Foo
  UserName="hello"
  phone_number={12345678}
/>

// good
<Foo
  userName="hello"
  phoneNumber={12345678}
/>

```

##括号

* 当组件跨行时，要用括号包裹 JSX 标签。eslint rules: [react/wrap-multilines](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/wrap-multilines.md)

```
/// bad
  render() {
    return <MyComponent className="long body" foo="bar">
             <MyChild />
           </MyComponent>;
  }

  // good
  render() {
    return (
      <MyComponent className="long body" foo="bar">
        <MyChild />
      </MyComponent>
    );
  }

  // good, when single line
  render() {
    const body = <div>hello</div>;
    return <MyComponent>{body}</MyComponent>;
  }
```

##标签

* 没有子组件的父组件使用自闭和标签。eslint rules: [react/self-closing-comp](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md)

```
    // bad
    <Foo className="stuff"></Foo>

    // good
    <Foo className="stuff" />
```
* 如果组件有多行属性，闭合标签应写在最后行上。eslint rules: [react/jsx-closing-bracket-location](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md)

```
    // good
    <Button
        firstName="John"
        lastName="Smith"/>
    
    <Button
        firstName="John"
        lastName="Smith" >
        点我一下
    </Button>

    // bad
    <Button
        firstName="John"
        lastName="Smith"
    />
  
    <Button
        firstName="John"
        lastName="Smith"
    >
        点我一下
    </Button>
```
* 如果是多个行 props,应该在新行下写
```
  // good
    <Hello personal={true} />
  
    <Hello
        personal={true}
        foo="bar" />
  
  // bad
    <Hello
        personal={true} />
    
    <Hello personal={true}
        foo="bar" />  
```
* 标签的缩进应该是4个空格
* 属性的缩进也是4个空格
* 多个组件遍历,请给组件加上 key
```
    // good
    [<Hello key="first" />, <Hello key="second" />, <Hello key="third" />];
    
    data.map((x, i) => <Hello key={i}>x</Hello>);
    
    // bad
    [<Hello />, <Hello />, <Hello />];
    
    data.map(x => <Hello>x</Hello>);
```
* 请不要写重复的 props 属性
```
    // bad ,检查会忽略大小写
    <Bar
        onChange={this.props.onBar} firstName="John"
        firsdtname="John"
        firsdtName="John">
        ada
    </Bar>
```
* 标签属性按照字母顺序,长短来排列,callback function 放在最后,如:
```
    <Bar
        firstMame="John"
        firstName="John"
        onChange={this.props.onBar} >
        美洽的美洽
    </Bar>
```
* 自闭合标签闭合处应该加上空格
```
    // good
    <Bar
        firstMame="John"
        firstName="John"
        onChange={this.props.onBar} />
        
    // bad
    <Bar
        firstMame="John"
        firstName="John"
        onChange={this.props.onBar}/>
```
* 多行 jsx 要用()包起来 [react/jsx-wrap-multilines](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md)
```
    // good
    import React from 'react';
    import PropTypes from 'prop-types';

    import classnames from 'classnames';
    
    const Button = ({className, disabled, children}) => (
        <button
            className={classnames('mcds-button', className)}
            disabled={disabled}>
            {children}
        </button>
    );
    
    Button.propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
        disabled: PropTypes.bool
    };
    
    export default Button;
    
    // bad, 多行没有用() 包起来,并且没有把 props 逐个列出来
    import React from 'react';
    import classnames from 'classnames';
    export let Button = props =>
        <button {...props} className={classnames('mcds-button', props.className)} disabled={props.disabled}>
            {props.children}
        </button>;
        
    // !!!注意,现在的 react-eslint 配置还不支持 stateless 组件,有人提 pr 了,作者会在下一个版本升级中合并进去,现在大家需要靠自觉和 review 来做这个事情,记住: 多行的 jsx 代码,要用()包起来!

```
* 标签和 props 里面的属性按照一定的顺序排列
```
    // good
    // required 放在最前面，callback func 放在最后面，各部分内部的排序推荐的是按照字母的排列顺序，这里就不强求了，如果要用这个插件就太恶心了，大家各自按照顺序比如由长到短这样，要求就是对你的 props 进行分类，不要写的乱七八糟
    static propTypes = {
        params: PropTypes.object.isRequired,

        push: PropTypes.func,
        account: PropTypes.object,

        requestUpdateAccount: PropTypes.func，
        requestFetchAccountDetail: PropTypes.func
    };

    // 这里的规则同上，对你的属性要有一个分类
    <Bar
        number="108"
        name="meiqia"
        onClick={this.handleBarClick}
        onChange={this.props.onChange} />

    // bad
    static propTypes = {
        push: PropTypes.func,
        requestUpdateAccount: PropTypes.func，
        params: PropTypes.object.isRequired,
        account: PropTypes.object,
        requestFetchAccountDetail: PropTypes.func
    };

    <Bar
        number="108"
        onClick={this.handleBarClick}
        name="meiqia"
        onChange={this.props.onChange} />

```
 

##事件

* 不要对 React 组件的内置方法使用 `underscore` 前缀

```
// bad
React.createClass({
  _onClickSubmit() {
    // do stuff
  }

  // other stuff
});

// good
class extends React.Component {
  onClickSubmit() {
    // do stuff
  }

  // other stuff
});
```
* 事件 handle 前缀是 handle,pros事件的前缀是 on.[react/jsx-handler-names](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md)
```
    // bad
    <MyComponent handleChange={this.handleChange} />
    <MyComponent onChange={this.componentChanged} />
    
    // good
    <MyComponent onChange={this.handleChange} />
    <MyComponent onChange={this.props.onFoo} />
```
##风格

* propTypes, contentTypes, @connect 统一放到组件文件末尾
```
EditModal.propTypes = {
    updateObject: PropTypes.func
    
};

EditModal.contextTypes = {
    router: PropTypes.object.isRequired
};

export default connect(
    () => ({}),
    dispatch => bindActionCreators({ updateObject }, dispatch)
)(EditModal);
```
* 组件文件中每一个 function 后面加一行空格
```
function A() {
    // do something

}
// 这里应该是一个空格
function B() {
    // do something
}

```
* 文件顶部 import 的时候分类并且按照长度排序
```
// 第三方包
import _ from 'lodash';
import moment from 'moment';
import {bindActionCreators} from 'redux';

// 自定义包
import BuildEditors from '../../get-suit-editors';
import { updateObject } from 'redux/reducers/standard-object/detailview/data';
import { formatValueBySchema, filterFormatValueByScheme } from 'utils/format-value';
```
