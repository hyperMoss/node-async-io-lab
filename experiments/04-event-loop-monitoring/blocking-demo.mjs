import { monitorEventLoopDelay, performance } from 'node:perf_hooks';

const histogram = monitorEventLoopDelay({ resolution: 10 });
histogram.enable();
let previous = performance.eventLoopUtilization();

setInterval(() => {
  const current = performance.eventLoopUtilization();
  const delta = performance.eventLoopUtilization(current, previous);
  previous = current;
  console.log({
    p99DelayMs: Number((histogram.percentile(99) / 1e6).toFixed(2)),
    maxDelayMs: Number((histogram.max / 1e6).toFixed(2)),
    elu: Number(delta.utilization.toFixed(3))
  });
  histogram.reset();
}, 1000);

const blockMs = Math.max(100, Math.min(5000, Number(process.env.BLOCK_MS ?? 1500)));
setTimeout(() => {
  console.log(`Blocking main JS thread for ${blockMs}ms...`);
  const start = performance.now();
  while (performance.now() - start < blockMs) {}
  console.log('Blocking finished.');
}, 2000);
