const Koa = require("koa");
const fs = require("fs");
const app = new Koa();

const Router = require("koa-router");

// 可以实现多个Router

// 子路由1
let home = new Router();
home.get("/", async (ctx) => {
  const data = await readFile("/home.html");
  ctx.body = data;
});

// 子路由2
let login = new Router();
login.get("/login", async (ctx) => {
  // 从本地读取出该路径下html文件的内容，然后返回给客户端
  const data = await readFile("/login.html");
  ctx.body = data;
});

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

let router = new Router();
router.use("/", home.routes(), home.allowedMethods()); //http://localhost:3000
router.use("/location", login.routes(), login.allowedMethods()); //http://localhost:3000/location/login

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log("[demo] route is starting at port 3000");
