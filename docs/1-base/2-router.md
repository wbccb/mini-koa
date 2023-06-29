# 路由

`koa`本身就是一个简单的框架，需要配合很多依赖库进行功能的完成，其中路由方面最常用的就是`koa-router`，那么当我们不使用这个`koa-router`的时候，我们该如何编写程序呢？

## 不使用koa-router中间件

```js
const Koa = require("koa");
const fs = require("fs");
const app = new Koa();

function readFile(path) {
    return new Promise((resolve, reject) => {
        let htmlUrl = `../front/${path}`;
        fs.readFile(htmlUrl, "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function parseUrl(url) {
    let base = "404.html";
    switch (url) {
        case "/":
            base = "index.html";
            break;
        case "/login.html":
            base = "login.html";
            break;
        case "/home.html":
            base = "home.html";
            break;
    }
    // 从本地读取出该路径下html文件的内容，然后返回给客户端
    const data = await readFile(base);
    return data;
}

app.use(async (ctx) => {
    let url = ctx.request.url;
    // 判断这个url是哪一个请求
    const htmlContent = await parseUrl(url);
    ctx.status = 200;
    ctx.body = htmlContent;
});
app.listen(3000);
console.log("[demo] route is starting at port 3000");
```




## 使用koa-router中间件

按照上面的代码所示，如果我们依靠`ctx.request.url`去手动处理路由，要写非常非常多的代码，而中间件`koa-router`可以帮助我们简化这个流程

### 安装koa-router中间件
```shell
npm install --save koa-router@7
```

### 使用koa-router中间件
如果依靠`ctx.request.url`去手动处理路由，将会写很多处理代码，这时候就需要对应的路由的中间件对路由进行控制
