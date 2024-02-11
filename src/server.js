import http from 'http'
import {getUsers, getUserById, createUser, updateUser, deleteUser } from './users'

const PORT = process.env.PORT || 4000

const server = http.createServer((req, res) => {
  const [_, resource, id] = req.url.split('/')
  switch (req.method) {
    case 'GET':
      if (resource === 'users') {
        if (id) getUserById(req, res, id)
        else getUsers(req, res)
      }
      break
    case 'POST':
      if (resource === 'users') createUser(req, res)
      break
    case 'PUT':
      if (resource === 'users') updateUser(req, res, id)
      break
    case 'DELETE':
      if (resource === 'users') deleteUser(req, res, id)
      break
    default:
      res.writeHead(404)
      res.end('Not found')
  }
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
