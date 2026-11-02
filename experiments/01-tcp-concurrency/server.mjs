import net from 'node:net';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 7001);
let active = 0;
let accepted = 0;
let bytes = 0;

const server = net.createServer((socket) => {
  active++;
  accepted++;
  socket.setNoDelay(true);
  socket.on('data', (chunk) => {
    bytes += chunk.length;
    socket.write(chunk);
  });
  socket.on('close', () => { active--; });
  socket.on('error', () => {});
});

server.listen(port, host, () => {
  console.log(`TCP echo server listening on ${host}:${port}`);
});

setInterval(() => {
  console.log(JSON.stringify({ active, accepted, bytes }));
}, 2000).unref();

function shutdown() {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 3000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
