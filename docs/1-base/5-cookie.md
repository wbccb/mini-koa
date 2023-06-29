# cookie

koa提供了直接读取和写入`cookie`的方法
- `ctx.cookies.get(name, [options])`读取ctx中的cookie
- `ctx.cookies.set(name, value, [options])`进行ctx的cookie的设置


```js
app.use(async (ctx) => {
    if (ctx.url === "/index") {
        ctx.cookies.set("cid", "hello world", {
            domain: "localhost", // cookie所在的域名
            path: "/index", // cookie所在域名
            maxAge: 10 * 60 * 1000, // http1.1 cache Control
            expires: 10 * 60 * 1000, // http1.0 cache Control
            httpOnly: false, // 是否只用于http请求中获取
            overwrite: false, // 是否允许重写
        });
        ctx.body = "cookie is ok";
    } else {
        ctx.body = "hello world";
    }
});
```




# session
