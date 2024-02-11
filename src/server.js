import http from 'http'
import dotenv from 'dotenv'
import { getUsers, getUserById, createUser, updateUser, deleteUser } from './users.js'
import { notFound, badRequest, internalServerError } from './responses.js'

const server = http.createServer((req, res) => {
  const urlParts = req.url.split('/')
  const method = req.method
  const id = urlParts[3]

  try {
    if (req.url.startsWith('/api/users') && method === 'GET' && id) {
      getUserById(req, res, id)
      return
    }
    if (req.url === '/api/users' && method === 'GET') {
      getUsers(req, res)
      return
    }
    if (req.url === '/api/users' && method === 'POST') {
      createUser(req, res)
      return
    }
    if (req.url.startsWith('/api/users') && method === 'PUT' && id) {
      updateUser(req, res, id)
      return
    }
    if (req.url.startsWith('/api/users') && method === 'DELETE' && id) {
      deleteUser(req, res, id)
      return
    }
    notFound(res)
  } catch (error) {
    internalServerError(res)
  }
})

dotenv.config()
const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
