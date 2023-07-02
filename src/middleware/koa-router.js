function Router(opts) {
  this.register = function (path, methods, callback, opts) {
    this.stack.push({
      path,
      methods,
      middleware: callback,
      opts,
    });
    return this;
  };

  this.routes = function () {
    // 返回所有注册的路由

    return async (ctx, next) => {
      // 每次执行中间件时，判断是否有符合register()的路由

      const path = ctx.path;
      const method = ctx.method.toUpperCase();

      let callback;

      for (const item of this.stack) {
        if (path === item.path && item.methods.indexOf(method) >= 0) {
          // 找到对应的路由
          callback = item.middleware;
          break;
        }
      }

      if (callback) {
        callback(ctx, next);
        return;
      }
      await next();
    };
  };

  this.allowedMethods = function () {
    // 在加了router.allowedMethods()中间件情况下，如果接口是get请求，而前端使用post请求，会返回405 Method Not Allowed ，提示方法不被允许 ，并在响应头有添加允许的请求方式；
    // 而在不加这个中间件这种情况下，则会返回 404 Not Found找不到请求地址，并且响应头没有添加允许的请求方式
    return async (ctx, next) => {
      // 检测if (!ctx.status || ctx.status === 404) {}
    };
  };

  this.opts = opts || {};
  this.methods = this.opts.methods || ["HEAD", "OPTIONS", "GET", "PUT", "PATCH", "POST", "DELETE"];
  this.stack = [];

  // TODO 根据methods初始化所有方法，形成this["get"]、this["put"]的数据结构

  for (const _method of this.methods) {
    this[_method.toLowerCase()] = this[_method] = function (path, callback) {
      this.register(path, [_method], callback);
    };
  }
}

// const app = new Koa();
// const router = new Router();
// router.get("/", (ctx, next) => {
//   // ctx.router available
// });
// router.get("/home", (ctx, next) => {
//   // ctx.router available
// });
// app.use(router.routes());

module.exports = Router;
