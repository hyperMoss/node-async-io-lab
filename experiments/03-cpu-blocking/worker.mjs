import { parentPort, workerData } from 'node:worker_threads';
const { iterations } = workerData;
const started = performance.now();
let value = 0;
for (let i = 0; i < iterations; i++) value = (value + Math.sqrt(i % 1000)) % 1e9;
parentPort.postMessage({ value, durationMs: performance.now() - started });
