import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { requestLogger, unknownEndpoint } from './middlewares/infoRequest'

import userRouter from './routes/users'
import profileRouter from './routes/profile'
import locationsRouter from './routes/locations'
import companyRouter from './routes/companies'
import audiovisualProjectsRouter from './routes/audiovisualProjects'

const app: Application = express()

app.use(cors())
app.use(morgan(':method :url :status :response-time ms'))
app.use(express.json())

if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger)
}

app.use('/api/users', userRouter)
app.use('/api/profile', profileRouter)
app.use('/api/locations', locationsRouter)
app.use('/api/companies', companyRouter)
app.use('/api/projects', audiovisualProjectsRouter)

// API health check route
app.get('/api', (_req, res) => {
  res.send(
    "API de la Comisión Fílmica de Ecuador | API's Ecuadorian Film Commission",
  )
})

app.use(unknownEndpoint)

export default app
