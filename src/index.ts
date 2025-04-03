import config from './config/env.config'
import app from './app'
import connectDataBase from './config/db.config'

connectDataBase()

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
