import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { requestLogger, unknownEndpoint } from './middlewares/infoRequest'
import userRouter from './routes/users'

const app: Application = express()

app.use(cors())
app.use(morgan(':method :url :status :response-time ms'))
app.use(express.json())

if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger)
}

// API health check route
app.get('/api', (_req, res) => {
  res.send(
    "API de la Comisión Fílmica de Ecuador | API's Ecuadorian Film Commission",
  )
})

app.use('/api/users', userRouter)

app.use(unknownEndpoint)

export default app
