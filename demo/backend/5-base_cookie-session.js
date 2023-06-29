const Koa = require("koa");
const fs = require("fs");
const app = new Koa();

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

app.listen(3003);
console.log("[demo] route is starting at port 3003");
