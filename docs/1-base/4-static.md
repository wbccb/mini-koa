# 静态资源存放和获取

`koa`本身就是一个简单的框架，需要配合很多依赖库进行功能的完成


其中路由方面最常用的就是`koa-static`，那么当我们不使用这个`koa-static`的时候，我们该如何编写程序呢？


## 不使用koa-static

如果我们不使用中间件，那么我们需要执行
- 判断当前请求是目录还是文件，如果是目录，则迭代读取，如果是文件，则进行内容的获取
  - 如果是目录，返回一个html数据，是一个列表数据展示目前的文件/目录数据
  - 如果是文件，直接返回数据的内容
- 判断类型是否是图片，如果是的话转化为二进制数据，否则输出文本格式


## 使用koa-static

当使用`koa-static`时，我们就不用自己处理目录/文件类型，直接指定对应的文件路径即可！

```js
const Koa = require("koa");
const path = require("path");
const static = require("koa-static");

const app = new Koa();

// 静态资源相对于入口文件index.js的路径
const staticPath = "./static";

app.use(static(path.join(__dirname, staticPath)));

app.use(async(ctx)=>{
    ctx.body = "hello world";
})

app.listen(3003);
```