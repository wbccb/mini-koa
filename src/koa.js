const context = require("./context.js");
const request = require("./request.js");
const response = require("./response.js");

function compose(middleware) {
  if (!Array.isArray(middleware)) throw new TypeError("Middleware stack must be an array!");
  for (const fn of middleware) {
    if (typeof fn !== "function") throw new TypeError("Middleware must be composed of functions!");
  }
  // 返回也是一个Promise，可能是Promise.resolve()，也有可能是Promise.reject()
  return function (context, next) {
    // 要求每一个fn返回都是一个Promise
    let index = -1;
    function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error("next()重复调用多次"));
      }
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) {
        // middleware[i]肯定为空，判断最后一个next()是否为空
        // 如果不为空，则继续执行最后一次
        // 如果为空，则返回Promise.resolve()
        fn = next;
      }
      if (!next) {
        return Promise.resolve();
      }
      try {
        // 可能返回只是一个普通的数据，因此需要使用Promise.resolve()进行包裹返回一个Promise数据
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  };
}

class Koa {
  constructor() {
    this.middleware = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }

  createContext(req, res) {
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  use(fn) {
    this.middleware.push(fn);
    return this;
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  callback() {
    let fn = compose(this.middleware);
    return (req, res) => {
      let context = this.createContext(req, res);
      this.handleRequest(context, fn);
    };
  }

  handleRequest(context, fn) {
    const next = function () {
      console.log("最后一个next()!");
    };
    fn(context, next)
      .then(() => {
        // 正常执行最终触发
        console.log("fn执行完毕!");
        context.res.end("执行完毕");
      })
      .catch((error) => {
        console.error("fn执行错误", error);
      });
  }
}

const app = new Koa();
app.use(async (ctx, next) => {
  console.log("fn1执行业务逻辑1");
  await next();
  await next();
  console.log("fn1执行业务逻辑2");
});
app.use(async (ctx, next) => {
  console.log("fn2执行业务逻辑1");
  await next();
  console.log("fn2执行业务逻辑2");
});
app.listen(200);
console.log("koa listen 200");
