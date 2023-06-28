# koa2快速开始

## 简介

Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。
Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

## 安装koa2


`node < 7.6` 如果要使用`async`方法，可以使用[babel's require hook](https://www.babeljs.cn/docs/babel-register)

`Koa` 依赖 `node v7.6.0` 或 `ES2015及更高版本`和 `async` 方法支持.

```shell
# 初始化package.json
npm init

# 安装koa2 
npm install koa
```

## 简单hello world

```js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(3000);
```


## app.listen(...)

Koa 应用程序不是 HTTP 服务器的1对1展现。 可以将一个或多个 Koa 应用程序安装在一起以形成具有单个HTTP服务器的更大应用程序
> 简单点说，就是`Node.js`的HTTP模块才能有效绑定到3000端口，Koa的`app.listen()`底层也是使用HTTP模块进行操作


`app.listen()`的语法糖就是`http.createServer(app.callback()).listen(3000);`

```js
const Koa = require('koa');
const app = new Koa();
app.listen(3000);
```

因此上面的代码等价于

```js
const http = require('http');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
```

可以将同一个`Koa应用程序`同时作为HTTP和HTTPS或者多个地址：

```js
const http = require('http');
const https = require('https');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
https.createServer(app.callback()).listen(3001);
```


## app.callback()


## app.use(function)

将给定的中间件方法添加到此应用程序。app.use() 返回 this, 因此可以链式表达

```js
app.use(someMiddleware)
app.use(someOtherMiddleware)
app.listen(3000)
```

也可以

```js
app.use(someMiddleware)
  .use(someOtherMiddleware)
  .listen(3000)
```

