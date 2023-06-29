# 文件

`busboy`库是为了用来解析POST请求中ctx.req（node.js原生对象）的文件流


## 安装

```shell
npm install busboy
```

## 例子

```js
const Busboy = require("busboy");

app.use(async (ctx) => {
  const req = ctx.req;

  const busboy = new Busboy({headers: req});
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    // 文件保存到特定路径
    file.pipe(fs.createWriteStream("./upload"));

    // 开始解析文件流
    file.on("data", function (data) {});

    // 解析文件结束
    file.on("end", function () {});
  });

  busboy.on("field", function (fieldname, val, filenameTruncated, valTruncated) {});

  busboy.on("finish", function () {
    ctx.res.writeHead(303, {Connection: "close", Location: "/"});
    ctx.end();
  });

  req.pipe(busboy);
});
```