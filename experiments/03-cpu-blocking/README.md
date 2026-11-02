# 实验 03：CPU 阻塞与 Worker Threads

## 运行

```bash
ITERATIONS=200000000 npm run cpu
```

程序分别在主线程和 Worker Thread 执行相同计算，同时安排 100ms 定时器。

## 观察

- 主线程计算期间，定时器回调无法执行，因此 timerDelayMs 会明显大于 100ms。
- Worker 计算在另一个 JavaScript 执行线程进行，主线程定时器通常能更接近预期时间。
- Worker 有启动和消息传递成本；任务太小时，使用 Worker 可能更慢。

## 思考

1. async 函数中的同步循环是否会阻塞主线程？
2. Worker Threads 和 libuv Thread Pool 有什么区别？
3. 为什么生产环境通常需要复用 Worker Pool，而不是每个请求创建一个 Worker？

实验会主动占用 CPU，请勿在生产服务执行。
