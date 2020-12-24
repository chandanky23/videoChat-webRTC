import express, { Request, Response } from 'express'

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

app.listen(8000, () => console.log('Listening to port 8000'))