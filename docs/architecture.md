# 架构说明

## 网络 I/O 路径

```text
TCP socket (non-blocking)
  -> OS readiness notification (epoll / kqueue / IOCP)
  -> libuv poll backend
  -> Node.js native callback bridge
  -> V8 executes JavaScript callback
```

这不是“一个连接一个线程”。操作系统报告就绪事件，事件循环处理相应回调。回调执行仍然受 JavaScript 主线程是否空闲影响。

## 线程池路径

```text
fs / crypto / dns.lookup / zlib async APIs
  -> Node.js Core
  -> libuv thread pool (for APIs using it)
  -> worker executes native work
  -> completion notification to loop
  -> callback / Promise settlement on JS thread
```

线程池共享资源。任务排队会影响其他使用同一线程池的操作，但不会自动阻塞网络 socket 的 I/O 通知路径。

## CPU JavaScript 路径

同步 CPU 计算在当前 JavaScript 线程执行。async/await 不会自动创建线程。Worker Threads 使用独立的 JavaScript 执行环境，适合 CPU 密集型任务。

## 重要边界

- libuv 线程池与 Node.js Worker Threads 是不同机制。
- Event Loop Delay 是调度延迟指标，不是 CPU 利用率。
- ELU 是事件循环活跃度指标，不等同于系统 CPU 使用率。
- 具体 I/O 后端与优化路径受 Node.js、libuv 版本及操作系统影响。
