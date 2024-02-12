import { cpus } from 'os';
import process from 'process';
import { createServer } from 'http';
import {server} from './server.js';

const cluster = await import('cluster');

const numCPUs = cpus().length;

if (cluster.default.isMaster) {
  console.log(`Master ${process.pid} is running`);

  let port = parseInt(process.env.PORT || '4000', 10);

  for (let i = 0; i < numCPUs - 1; i++) {
    let worker = cluster.default.fork();
    worker.send({ workerPort: port + i });
  }

  cluster.default.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  process.on('message', (msg) => {
    createServer(server).listen(msg.workerPort);
    console.log(`Worker ${process.pid} started on port ${msg.workerPort}`);
  });
}
