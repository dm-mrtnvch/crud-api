import { v4 as uuidv4 } from 'uuid'
import { readFileSync, writeFileSync } from 'fs'
import {badRequest} from './responses';

const usersFile = 'users.json'

const users = []

const readUsers = () => JSON.parse(readFileSync(usersFile, { encoding: 'utf8', flag: 'a+' }) || '[]')

const writeUsers = (users) => writeFileSync(usersFile, JSON.stringify(users, null, 2))

export const getUsers = (req, res) => {
  const users = readUsers()
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(users))
}

export const getUserById = (req, res, id) => {
  const users = readUsers()
  const user = users.find(user => user.id === id)
  if (!user) {
    res.writeHead(404)
    res.end('User not found')
    return
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(user))
}

export const createUser = (req, res) => {
  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })
  req.on('end', () => {
    const { username, age, hobbies } = JSON.parse(body)
    if (!username || !age || !hobbies) {
      badRequest(res)
      return
    }
    const newUser = { id: uuidv4(), username, age, hobbies }
    const users = readUsers()
    users.push(newUser)
    writeUsers(users)
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(newUser))
  })
}

export const updateUser = (req, res, id) => {
  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })
  req.on('end', () => {
    const users = readUsers()
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) {
      res.writeHead(404)
      res.end('User not found')
      return
    }
    const updates = JSON.parse(body)
    users[userIndex] = { ...users[userIndex], ...updates }
    writeUsers(users)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(users[userIndex]))
  })
}

export const deleteUser = (req, res, id) => {
  const users = readUsers()
  const userIndex = users.findIndex(user => user.id === id)
  if (userIndex === -1) {
    res.writeHead(404)
    res.end('User not found')
    return
  }
  users.splice(userIndex, 1)
  writeUsers(users)
  res.writeHead(204)
  res.end()
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser }
