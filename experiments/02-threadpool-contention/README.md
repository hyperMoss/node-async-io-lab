# 实验 02：libuv 线程池竞争

本实验同时提交异步 PBKDF2 与文件读取，观察它们共享线程池时的完成延迟。PBKDF2 是 CPU 密集型原生工作，文件读取通常通过 libuv 线程池执行。

## 运行

每种线程池大小都必须启动一个新进程：

```bash
UV_THREADPOOL_SIZE=2 TASKS=12 npm run pool
UV_THREADPOOL_SIZE=4 TASKS=12 npm run pool
UV_THREADPOOL_SIZE=8 TASKS=12 npm run pool
```

`UV_THREADPOOL_SIZE` 应在 Node.js 启动前设置。不要在同一进程中修改它来做对比。

## 观察

记录 crypto/fs 的 P50、P95、最大完成时间。多跑几轮，比较趋势。文件很小且可能命中缓存，因此不要把 fs 的单次耗时解释为真实磁盘吞吐。

## 思考

1. 增大线程池后 crypto 延迟是否下降？
2. fs 是否会受到 crypto 任务竞争影响？
3. 为什么线程池无限增大并不是优化方案？
4. 线程池被占满是否意味着 TCP socket 事件也不能进入 Event Loop？

注意：线程池大小、CPU 核数和系统负载都会影响结果。
