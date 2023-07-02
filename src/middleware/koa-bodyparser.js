/**
 * 注册对应的监听方法，进行request流数据的读取
 * @param req
 */
function readStreamBody(req) {
  return new Promise((resolve, reject) => {
    let postData = "";
    req.addListener("data", (data) => {
      postData = postData + data;
    });

    req.addListener("end", () => {
      if (postData) {
        resolve(postData);
      } else {
        resolve("没有数据");
      }
    });
  });
}

async function parseQuery(data) {
  let result = {};
  let dataList = data.split("&");
  for (let [index, queryString] of dataList.entries()) {
    let itemList = queryString.split("=");
    result[itemList[0]] = itemList[1];
  }
  return result;
}

async function parseJSON(ctx, data) {
  let result = {};
  try {
    result = JSON.parse(data);
  } catch (e) {
    ctx.throw(500, e);
  }
  return result;
}

function bodyParser() {
  return async (ctx, next) => {
    if (!ctx.request.body && ctx.method === "POST") {
      let body = await readStreamBody(ctx.request.req);
      // With Content-Type: text/html; charset=utf-8
      // this.is('html'); // => 'html'
      // this.is('text/html'); // => 'text/html'
      // this.is('text/', 'application/json'); // => 'text/html'
      //
      // When Content-Type is application/json
      // this.is('json', 'urlencoded'); // => 'json'
      // this.is('application/json'); // => 'application/json'
      // this.is('html', 'application/'); // => 'application/json'
      //
      // this.is('html'); // => false
      let result;
      if (ctx.request.is("application/x-www-form-urlencoded")) {
        result = await parseQuery(body);
      } else if (ctx.request.is("application/json")) {
        result = await parseJSON(ctx, body);
      } else if (ctx.request.is("text/plain")) {
        result = body;
      }
      ctx.request.body = result;
    }
    await next();
  };
}

module.exports = bodyParser;
