import path from 'path'
import express, { Request, Response } from 'express'
import http from 'http'
import cors from 'cors'
import { init as InitSocketIO } from './websockets'

class App {
  public app = express()
  public server: http.Server
  public socket
  public rooms: any

  constructor() {
    this.server = http.createServer(this.app)
    this.socket = InitSocketIO(this.server, this.rooms)
    this.rooms = {}

    this.middlewares()
    this.routes()
  }

  private middlewares(): void {
    this.app.use(cors())
  }

  private routes(): void {
    // Default route
    this.app.get('/', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, '../../build/index.html'))
    })
    this.app.use(express.static(path.resolve(__dirname, '../../build')))
  }
}

export default new App()
