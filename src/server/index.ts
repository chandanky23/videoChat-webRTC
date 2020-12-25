import app from './app'

const port = process.env.PORT || 3000

const server = app.server

server.listen(port, () => {
  console.log(`Server is running at port: ${port}`)
})
