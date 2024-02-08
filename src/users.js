const users = []

function findUserIndexById(id) {
  return users.findIndex(user => user.id === id)
}

function getUsers(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(users))
}

function getUserById(req, res, id) {
  const index = findUserIndexById(id)
  if (index !== -1) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(users[index]))
  } else {
    res.writeHead(404)
    res.end('User not found')
  }
}

function createUser(req, res) {
  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })
  req.on('end', () => {
    const { username, age, hobbies } = JSON.parse(body)
    const newUser = { id: String(users.length + 1), username, age, hobbies }
    users.push(newUser)
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(newUser))
  })
}

function updateUser(req, res, id) {
  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })
  req.on('end', () => {
    const index = findUserIndexById(id)
    if (index !== -1) {
      const { username, age, hobbies } = JSON.parse(body)
      users[index] = { ...users[index], username, age, hobbies }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(users[index]))
    } else {
      res.writeHead(404)
      res.end('User not found')
    }
  })
}

function deleteUser(req, res, id) {
  const index = findUserIndexById(id)
  if (index !== -1) {
    users.splice(index, 1)
    res.writeHead(204)
    res.end()
  } else {
    res.writeHead(404)
    res.end('User not found')
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser }
