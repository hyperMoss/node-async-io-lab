import { monitorEventLoopDelay, performance } from 'node:perf_hooks';

const resolution = Math.max(10, Math.min(100, Number(process.env.RESOLUTION ?? 20)));
const intervalMs = Math.max(500, Number(process.env.INTERVAL ?? 2000));
const histogram = monitorEventLoopDelay({ resolution });
histogram.enable();
let previous = performance.eventLoopUtilization();

console.log(`Monitoring Event Loop. resolution=${resolution}ms interval=${intervalMs}ms. Ctrl+C to stop.`);

const timer = setInterval(() => {
  const current = performance.eventLoopUtilization();
  const delta = performance.eventLoopUtilization(current, previous);
  previous = current;
  const ms = (ns) => Number((ns / 1e6).toFixed(2));
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    delayMs: {
      mean: ms(histogram.mean),
      p50: ms(histogram.percentile(50)),
      p95: ms(histogram.percentile(95)),
      p99: ms(histogram.percentile(99)),
      max: ms(histogram.max)
    },
    elu: Number(delta.utilization.toFixed(4)),
    eluActiveMs: Number(delta.active.toFixed(2)),
    eluIdleMs: Number(delta.idle.toFixed(2))
  }));
  histogram.reset();
}, intervalMs);

function stop() {
  clearInterval(timer);
  histogram.disable();
  process.exit(0);
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
