import config from './config/envConfig'
import app from './app'
import connectDataBase from './config/dbConfig'

connectDataBase()

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
