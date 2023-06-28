# 请求参数解析

`koa`本身就是一个简单的框架，需要配合很多依赖库进行功能的完成，其中路由方面最常用的就是`koa-bodyparser`，那么当我们不使用这个`koa-bodyparser`的时候，我们该如何编写程序呢？


## 不使用koa-bodyparser中间件

### req、request、res、response
1. `ctx.req`是原生node.js的请求对象
2. `ctx.request`是context进行封装的请求对象
3. `ctx.res`是原生node.js的请求对象
4. `ctx.response`是context进行封装的请求对象

### GET请求

1. `query`是格式化好的参数对象，比如`query={a:1, b:2}`
2. `querystring`是请求字符串，比如`querystring="a=1&b=2"`

```js
let request = ctx.request;
let query = request.query;
let queryString = request.querystring;
// 也可以直接省略request，const {query, querystring} = request
```


### POST请求
没有封装具体的方法，需要手动解析`ctx.req`这个原生的node.js对象


如下面例子所示，`ctx.req`获取到`formData`为`'userName=22&nickName=22323&email=32323'`


我们需要将`formData`解析为`{userName: 22, nickName: 22323, email: 32323}`


```js
home.post("b", async (ctx) => {
  const body = await parseRequestPostData(ctx);
  ctx.body = body;
});

async function transStringToObject(data) {
  let result = {};
  let dataList = data.split("&");
  for (let [index, queryString] of dataList.entries()) {
    let itemList = queryString.split("=");
    result[itemList[0]] = itemList[1];
  }
  return result;
}

async function parseRequestPostData(ctx) {
  return new Promise((resolve, reject) => {
    const req = ctx.req;
    let postData = "";
    req.addListener("data", (data) => {
      postData = postData + data;
    });

    req.addListener("end", () => {
      if (postData) {
        let parseData = transStringToObject(postData);
        resolve(parseData);
      } else {
        resolve("没有数据");
      }
    });
  });
}
```




## 使用koa-bodyparser中间件


### 安装

```shell
npm install koa-bodyparser
```

### 使用

```js
const Koa = require("koa");
const fs = require("fs");
const app = new Koa();

const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

// post请求参数解析示例
home.get("form", async (ctx) => {
    let html = `
      <h1>koa2 request post demo</h1>
      <form method="POST" action="/b">
        <p>userName</p>
        <input name="userName" /><br/>
        <p>nickName</p>
        <input name="nickName" /><br/>
        <p>email</p>
        <input name="email" /><br/>
        <button type="submit">submit</button>
      </form>
    `;
    ctx.body = html;
});
home.post("b", async (ctx) => {
    // 普通解析逻辑
    // const body = await parseRequestPostData(ctx);
    // ctx.body = body;

    // 使用koa-bodyparser会自动解析表单的数据然后放在ctx.request.body中
    let postData = ctx.request.body;
    ctx.body = postData;
});

let router = new Router();
router.use("/", home.routes(), home.allowedMethods()); //http://localhost:3000

app.use(bodyParser()); // 这个中间件的注册应该放在router之前！
app.use(router.routes()).use(router.allowedMethods());

app.listen(3002);
```