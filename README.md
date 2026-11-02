# Node.js 异步 I/O 调度实验室

通过四组可运行实验，观察 Node.js Event Loop、libuv 线程池、TCP 并发、Worker Threads 与事件循环性能指标。

> 目标不是背诵执行顺序，而是把 **JavaScript API → Node.js Core → libuv → 操作系统 → 回调** 的路径与真实运行结果对应起来。

## 实验目录

| 实验 | 观察重点 | 入口 |
|---|---|---|
| 01. TCP 并发连接 | 大量 Socket、连接并发度、Echo RTT、吞吐量 | [实验说明](experiments/01-tcp-concurrency/README.md) |
| 02. 线程池竞争 | `UV_THREADPOOL_SIZE`、异步 PBKDF2 与文件读取延迟 | [实验说明](experiments/02-threadpool-contention/README.md) |
| 03. CPU 阻塞 | 主线程同步计算与 Worker Threads 的差异 | [实验说明](experiments/03-cpu-blocking/README.md) |
| 04. Event Loop 监控 | Event Loop Delay、P99、ELU | [实验说明](experiments/04-event-loop-monitoring/README.md) |

## 环境要求

- Node.js 20 或更高版本
- npm（无需安装第三方依赖）
- macOS、Linux 或 Windows

## 快速开始

```bash
git clone https://github.com/hyperMoss/node-async-io-lab.git
cd node-async-io-lab
npm run check
```

各实验需要独立启动，具体命令和注意事项见对应实验目录。

## 推荐学习顺序

1. TCP 并发：先理解网络 I/O 就绪通知与事件循环。
2. 线程池竞争：理解文件 I/O、加密任务与 libuv Worker Pool。
3. CPU 阻塞：区分异步 I/O 与 CPU 并行计算。
4. Event Loop 监控：用延迟和利用率指标观察前面三个实验的影响。

更完整的概念图见 [架构说明](docs/architecture.md)，建议按 [学习路线](docs/learning-path.md) 完成实验记录。

## 安全与实验边界

- TCP 服务默认只绑定 `127.0.0.1`，仅用于本机实验。
- 客户端默认限制连接数和并发数；不要未经评估就把参数调到极高。
- CPU 实验会故意制造主线程阻塞；请在本机开发环境运行，不要在生产服务执行。
- 线程池大小必须在 Node.js 进程启动前通过环境变量设置。
- 实验结果受操作系统、CPU、磁盘缓存、Node.js/libuv 版本和系统负载影响，不应把单次数字当作普遍性能结论。

## 关键认知

- TCP Socket 通常通过操作系统非阻塞 I/O 事件机制处理，不是每个连接对应一个 libuv 工作线程。
- Node.js 异步文件系统 API 通常使用 libuv 线程池；不同 Node.js/libuv 版本和平台可能有不同优化路径。
- `UV_THREADPOOL_SIZE` 只影响 libuv 线程池，不会改变 JavaScript 主线程数量，也不等于 Worker Threads 数量。
- `async/await` 不会自动把 CPU 密集型 JavaScript 移到其他线程。
- Event Loop Utilization（ELU）不是 CPU 使用率。

## 参考资料

- [Node.js: The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [Node.js: Don't Block the Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
- [Node.js: Worker Threads](https://nodejs.org/api/worker_threads.html)
- [Node.js: perf_hooks](https://nodejs.org/api/perf_hooks.html)
- [libuv: Design overview](https://docs.libuv.org/en/v1.x/design.html)
- [libuv: Thread pool work scheduling](https://docs.libuv.org/en/v1.x/threadpool.html)

## License

MIT
