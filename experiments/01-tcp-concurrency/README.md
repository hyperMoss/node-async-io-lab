# 实验 01：TCP 并发连接

## 运行

终端 A：

```bash
npm run tcp:server
```

终端 B：

```bash
CONNECTIONS=200 CONCURRENCY=50 MESSAGES=20 npm run tcp:client
```

Windows PowerShell 可使用 `$env:CONNECTIONS=200` 等方式设置变量。

## 观察

- 服务端 active 表示当前活跃连接数。
- accepted 是累计接收连接数。
- 客户端输出 RTT 分位数、吞吐量和错误数。
- 分别调整 CONNECTIONS 与 CONCURRENCY，区分总连接量和同时运行的客户端数量。

## 思考

1. 连接数增加时，服务端线程数是否随连接数线性增加？
2. 为什么客户端 RTT 会随并发上升？
3. Event Loop 被同步计算阻塞时，Socket 数据到达后能否立即执行 JS data 回调？

默认只监听 localhost。请勿直接暴露到公网或用极端参数压测他人服务。
