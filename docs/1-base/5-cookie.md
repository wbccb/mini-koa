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


koa原生没有提供session操作相关的API，只能自己实现：
- 如果`session`数据量很小，可以直接存在内存中
- 如果`session`数据量很大，则需要借助数据库或者其它介质进行存储

## 数据库存储

### 安装中间件

```shell
npm install koa-session-minimal koa-mysql-session
```

- `koa-session-minimal`提供介质的读写借口
- `koa-mysql-session`为koa-session-minimal中间件提供MySQL数据库的session数据读写操作


### 具体实现步骤

- 将数据库存储的`sessionId`存到页面的`cookie`中
- 根据`cookie`的`sessionId`去获取对应的session信息

### 代码示例
```js

const Session = require("koa-session-minimal");
const MySqlSession = require("koa-mysql-session");

// 数据库相关信息
let store = new MySqlSession({
  user: "root",
  password: "12323",
  database: "koa-demo",
  host: "127.0.0.1",
});

// 存放在sessionId的cookie的相关配置
let cookie = {
  maxAge: "", // cookie的有效时长
  expires: "", // cookie失效时间
  path: "", // cookie所在的路径
  domain: "", // cookie所在的域名
  httpOnly: "",
  overwrite: "",
  secure: "",
  sameSite: "",
  signed: "",
};
app.use(
  Session({
    key: "SESSION_ID",
    store: store,
    cookie: cookie,
  })
);

app.use(async (ctx) => {
    if (ctx.url === "/set") {
        ctx.session = {
            user_id: Math.random().toString(36).substr(2),
            count: 0,
        };
        ctx.body = ctx.session;
    } else if (ctx.url === "/") {
        ctx.session.count = ctx.session.count + 1;
        ctx.body = ctx.session;
    }
});
```
