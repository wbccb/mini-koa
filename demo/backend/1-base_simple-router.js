const Koa = require("koa");
const fs = require("fs");
const app = new Koa();

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

async function parseUrl(url) {
    let base = "404.html";
    switch (url) {
        case "/":
            base = "index.html";
            break;
        case "/login.html":
            base = "login.html";
            break;
        case "/home.html":
            base = "home.html";
            break;
    }
    // 从本地读取出该路径下html文件的内容，然后返回给客户端
    const data = await readFile(base);
    return data;
}

app.use(async (ctx) => {
    let url = ctx.request.url;
    // 判断这个url是哪一个请求
    const htmlContent = await parseUrl(url);
    ctx.status = 200;
    ctx.body = htmlContent;
});
app.listen(3001);
console.log("[demo] route is starting at port 3001");
