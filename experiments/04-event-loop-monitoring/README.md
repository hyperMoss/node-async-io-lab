# 实验 04：Event Loop Delay 与 ELU

## 运行

终端 A：观察空闲状态。

```bash
npm run monitor
```

终端 B：制造一次主线程阻塞。

```bash
BLOCK_MS=1500 npm run monitor:block
```

也可以直接运行监控和阻塞 demo 于同一进程：

```bash
node experiments/04-event-loop-monitoring/blocking-demo.mjs
```

## 指标解释

- Event Loop Delay：事件循环采样延迟的直方图，单位转换为毫秒。
- P99：99% 的采样延迟不超过该值。
- ELU：Event Loop Utilization，衡量采样窗口内事件循环处于 active 状态的比例。
- ELU 不是系统 CPU 使用率；它不能直接说明 CPU 核心利用率。

## 思考

1. 同步阻塞时，为什么 Delay 会升高？
2. ELU 高是否一定意味着 CPU 满载？
3. 一个进程等待网络 I/O 时，ELU 会是什么趋势？
4. 如何结合 CPU、GC、外部依赖耗时来定位实际瓶颈？
