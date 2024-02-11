export const notFound = (res) => {
  res.writeHead(404)
  res.end('Not Found')
}

export const badRequest = (res) => {
  res.writeHead(400)
  res.end('Bad Request')
}

export const internalServerError = (res) => {
  res.writeHead(500)
  res.end('Internal Server Error')
}
