const Koa = require("koa");
const fs = require("fs");
const app = new Koa();

const Router = require("koa-router");

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

app.listen(3003);
console.log("[demo] route is starting at port 3003");
