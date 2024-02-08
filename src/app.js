import http from 'http'
import { usersRoutesHandler } from './api/users/users.routes'

const requestListener = (req, res) => {
  usersRoutesHandler(req, res)
}

export default requestListener
