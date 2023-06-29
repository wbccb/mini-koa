const Koa = require("koa");
const fs = require("fs");
const app = new Koa();

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

app.listen(3003);
console.log("[demo] route is starting at port 3003");
