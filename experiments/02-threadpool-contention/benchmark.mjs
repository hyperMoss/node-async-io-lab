import fs from 'node:fs';
import os from 'node:os';
import crypto from 'node:crypto';
import { performance } from 'node:perf_hooks';

const count = Math.max(1, Math.min(64, Number(process.env.TASKS ?? 12)));
const iterations = Math.max(1, Number(process.env.ITERATIONS ?? 150000));
const samplePath = new URL('../../README.md', import.meta.url);
const durations = { crypto: [], fs: [] };
const start = performance.now();

function record(type, at) {
  durations[type].push(performance.now() - at);
}
function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)] ?? 0;
}
function summary(values) {
  return {
    count: values.length,
    p50Ms: Number(percentile(values, 0.5).toFixed(2)),
    p95Ms: Number(percentile(values, 0.95).toFixed(2)),
    maxMs: Number(Math.max(0, ...values).toFixed(2))
  };
}

const jobs = [];
for (let i = 0; i < count; i++) {
  jobs.push(new Promise((resolve) => {
    const at = performance.now();
    crypto.pbkdf2('lab-password', `salt-${i}`, iterations, 32, 'sha256', () => {
      record('crypto', at);
      resolve();
    });
  }));
  jobs.push(new Promise((resolve) => {
    const at = performance.now();
    fs.readFile(samplePath, () => {
      record('fs', at);
      resolve();
    });
  }));
}
await Promise.all(jobs);
const elapsed = performance.now() - start;
console.log(JSON.stringify({
  node: process.version,
  platform: `${os.platform()} ${os.arch()}`,
  uvThreadpoolSize: process.env.UV_THREADPOOL_SIZE ?? '(default: 4)',
  tasksPerType: count,
  pbkdf2Iterations: iterations,
  elapsedMs: Number(elapsed.toFixed(2)),
  crypto: summary(durations.crypto),
  fs: summary(durations.fs),
  note: 'Run separate processes for each UV_THREADPOOL_SIZE. Results are affected by CPU, filesystem cache and machine load.'
}, null, 2));
