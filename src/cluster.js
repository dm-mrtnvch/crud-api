import cluster from 'src/cluster.js'
import { cpus } from 'os'
import process from 'process'
import http from 'http'
import { server as app } from './server.js'

const numCPUs = cpus().length

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  let port = parseInt(process.env.PORT || '4000', 10)

  for (let i = 0; i < numCPUs - 1; i++) {
    let worker = cluster.fork();
    worker.send({ workerPort: port + i })
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  process.on('message', (msg) => {
    http.createServer(app).listen(msg.workerPort)
    console.log(`Worker ${process.pid} started on port ${msg.workerPort}`)
  })
}
