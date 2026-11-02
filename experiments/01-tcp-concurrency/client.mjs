import net from 'node:net';
import { performance } from 'node:perf_hooks';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 7001);
const connections = Math.max(1, Math.min(1000, Number(process.env.CONNECTIONS ?? 100)));
const concurrency = Math.max(1, Math.min(connections, Number(process.env.CONCURRENCY ?? 50)));
const messages = Math.max(1, Math.min(10000, Number(process.env.MESSAGES ?? 20)));
const payload = Buffer.from('node-async-io-lab');

let next = 0;
let completed = 0;
let errors = 0;
let bytes = 0;
const latencies = [];
const started = performance.now();

function runClient() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    let pending = [];
    let sent = 0;
    let received = 0;
    let done = false;

    const finish = (failed = false) => {
      if (done) return;
      done = true;
      if (failed) errors++;
      socket.destroy();
      resolve();
    };

    socket.setTimeout(15000, () => finish(true));
    socket.on('connect', sendNext);
    socket.on('data', (chunk) => {
      bytes += chunk.length;
      let offset = 0;
      while (offset < chunk.length && pending.length) {
        const item = pending[0];
        const remaining = item.remaining;
        const take = Math.min(remaining, chunk.length - offset);
        item.remaining -= take;
        offset += take;
        if (item.remaining === 0) {
          pending.shift();
          received++;
          latencies.push(performance.now() - item.at);
        }
      }
      if (received === messages) finish();
      else sendNext();
    });
    socket.on('error', () => finish(true));

    function sendNext() {
      while (sent < messages && pending.length < 1) {
        pending.push({ remaining: payload.length, at: performance.now() });
        socket.write(payload);
        sent++;
      }
    }
  });
}

async function worker() {
  while (true) {
    const index = next++;
    if (index >= connections) return;
    await runClient();
    completed++;
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
latencies.sort((a, b) => a - b);
const percentile = (p) => latencies.length ? latencies[Math.min(latencies.length - 1, Math.ceil(p * latencies.length) - 1)] : 0;
const durationMs = performance.now() - started;
console.log(JSON.stringify({
  connections, concurrency, messagesPerConnection: messages,
  completed, errors, echoedBytes: bytes, durationMs: Number(durationMs.toFixed(2)),
  requestsPerSecond: Number((latencies.length / (durationMs / 1000)).toFixed(2)),
  rttMs: { p50: percentile(0.50), p95: percentile(0.95), p99: percentile(0.99) }
}, null, 2));
