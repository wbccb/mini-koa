const Koa = require("koa");
const fs = require("fs");
const app = new Koa();

const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

// 可以实现多个Router

// get请求参数解析示例
let home = new Router();
home.get("a", async (ctx) => {
  let request = ctx.request;
  let query = request.query;
  let queryString = request.querystring;
  // 也可以直接省略request，const {query, querystring} = request

  ctx.body = {
    query,
    queryString,
  };
});

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

let router = new Router();
router.use("/", home.routes(), home.allowedMethods()); //http://localhost:3000

app.use(bodyParser()); // 这个中间件的注册应该放在router之前！
app.use(router.routes()).use(router.allowedMethods());

app.listen(3002);
console.log("[demo] route is starting at port 3002");
