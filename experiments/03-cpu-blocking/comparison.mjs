import { Worker } from 'node:worker_threads';
import { performance } from 'node:perf_hooks';

const iterations = Math.max(1e6, Math.min(2e9, Number(process.env.ITERATIONS ?? 2e8)));
const delayMs = 100;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function measureMainThread() {
  const timerStart = performance.now();
  const timer = wait(delayMs).then(() => performance.now() - timerStart);
  const start = performance.now();
  let value = 0;
  for (let i = 0; i < iterations; i++) value = (value + Math.sqrt(i % 1000)) % 1e9;
  const computeMs = performance.now() - start;
  return { computeMs, timerDelayMs: await timer, value };
}

async function measureWorker() {
  const timerStart = performance.now();
  const timer = wait(delayMs).then(() => performance.now() - timerStart);
  const start = performance.now();
  const result = await new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.mjs', import.meta.url), {
      workerData: { iterations }
    });
    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
    });
  });
  return { wallMs: performance.now() - start, timerDelayMs: await timer, workerComputeMs: result.durationMs };
}

console.log('main-thread:', await measureMainThread());
console.log('worker-thread:', await measureWorker());
