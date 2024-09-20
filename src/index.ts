import config from './config/envConfig'
import app from './app'
import connctDataBase from './config/dbConfig'

connctDataBase()

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
