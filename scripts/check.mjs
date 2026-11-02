import fs from 'node:fs';
import path from 'node:path';

const required = [
  'README.md',
  'docs/architecture.md',
  'docs/learning-path.md',
  'experiments/01-tcp-concurrency/server.mjs',
  'experiments/01-tcp-concurrency/client.mjs',
  'experiments/02-threadpool-contention/benchmark.mjs',
  'experiments/03-cpu-blocking/worker.mjs',
  'experiments/03-cpu-blocking/comparison.mjs',
  'experiments/04-event-loop-monitoring/monitor.mjs',
  'experiments/04-event-loop-monitoring/blocking-demo.mjs'
];
const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error('Missing files:', missing);
  process.exitCode = 1;
} else {
  console.log(`OK: all ${required.length} required files exist.`);
}
