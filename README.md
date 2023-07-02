# mini-koa2


## 调试管理工具pm2 & nodeme

### 简介
pm2 是一个带有负载均衡的Node应用的进程管理器, 它能够管理Node应用，还能够对应用的运行状态进行监控。

### 启动管理node.js
```shell
$ npm install pm2 -g          // pm2 命令安装
$ pm2 start app.js -i 2       // 后台运行pm2，启动2个app.js
$ pm2 start app.js --name xxx // 命名进程为xxx
```

### 常用命令

```shell
$ pm2 list            // 显示所有进程状态
$ pm2 monit           // 监视所有进程
$ pm2 logs            // 显示所有进程日志
$ pm2 stop all        // 停止所有进程
$ pm2 restart all     // 重启所有进程
$ pm2 reload all      // 0秒停机重载进程
$ pm2 stop 0          // 停止指定的进程
$ pm2 restart 0       // 重启指定的进程
$ pm2 startup         // 产生init脚本，保持进程活着
$ pm2 delete 0        // 杀死指定的进程
$ pm2 delete all      // 杀死全部进程
$ pm2 web             // 监控所有被pm2管理的进程
```

## docs
### 1-base
`Koa2`基础知识总结

### 2-source

`Koa2`源码分析文章

### 3-interview

`Koa2`常见的面试题，从面试题更加深入理解`Koa2`


## demo

配套的代码示例


## src
`mini-koa2`手写代码目录