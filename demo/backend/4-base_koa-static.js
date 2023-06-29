const Koa = require("koa");
const fs = require("fs");
const app = new Koa();

const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

const mimes = {
  css: "text/css",
  less: "text/css",
  gif: "image/gif",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  pdf: "application/pdf",
  png: "image/png",
  svg: "image/svg+xml",
  swf: "application/x-shockwave-flash",
  tiff: "image/tiff",
  txt: "text/plain",
  wav: "audio/x-wav",
  wma: "audio/x-ms-wma",
  wmv: "video/x-ms-wmv",
  xml: "text/xml",
};

// -------------------
async function walkDir(url) {
  // 读取目录内容（子目录、文件）
  const files = fs.readdirSync(url);

  let dirList = [];
  let fileList = [];
  const len = files.length;
  for (let i = 0; i < len; i++) {
    const item = files[i];
    const itemArr = item.split(".");

    // 判断是目录还是文件类型
    if (itemArr.length > 1) {
      // 文件类型
      const itemMime = itemArr[itemArr.length - 1];
      if (mimes[itemMime] === undefined) {
        // 未知类型
        dirList.push(item);
      } else {
        fileList.push(item);
      }
    } else {
      dirList.push(item);
    }

    return dirList.concat(fileList);
  }
}

async function getDirContent(name, fullPath) {
  const contentList = walkDir(fullPath);
  let html = "";
  const tag = "<ul>";
  html = tag;
  // 罗列List，返回一个html格式的列表数据，让用户自己点击选择
  for (const [index, item] of contentList) {
    html = html + `<li><a href="${name === "/" ? "" : name}/${item}">${item}</a></li>`;
  }
  html = html + `${tag}`;

  return html;
}

async function getFileContent(url) {
  const content = fs.readFileSync(url, "binary");
  return content;
}

// -------------------

// 可以实现多个Router

const staticPath = "./static";
// get请求参数解析示例
let home = new Router();
home.get("a", async (ctx) => {
  const fullStaticPath = path.join(__dirname, staticPath);

  const content = await getContent(ctx, fullStaticPath);

  // 判断是否是图片
  const mime = getMimes(ctx);
  if (mime) {
    ctx.type = mime;
    if (mime.indexOf("image/") >= 0) {
      // 如果是图片，返回二进制数据
      ctx.res.writeHead(200);
      ctx.res.write(content, "binary");
      ctx.res.end();
    }
  } else {
    ctx.body = content;
  }
});

async function getMimes(ctx) {
  let extName = path.extname(ctx.url);
  extName = extName ? extName.slice(1) : "unknown";
  return mimes[extName];
}

async function getContent(ctx, fullStaticPath) {
  // 请求链接为：http://localhost:3003/2.png
  const url = ctx.url;
  const fullUrl = path.join(fullStaticPath, url);

  let content = "";
  const isExist = fs.existsSync(fullUrl);
  if (!isExist) {
    // 文件/目录不存在
    content = "404 Not Found!";
  } else {
    let stat = fs.statSync(fullUrl);
    if (stat.isDirectory()) {
      // 目录
      content = await getDirContent(ctx.url, fullUrl);
    } else {
      content = await getFileContent(fullUrl);
    }
  }

  return content;
}

let router = new Router();
router.use("/", home.routes(), home.allowedMethods()); //http://localhost:3000

app.use(bodyParser()); // 这个中间件的注册应该放在router之前！
app.use(router.routes()).use(router.allowedMethods());

app.listen(3003);
console.log("[demo] route is starting at port 3003");
