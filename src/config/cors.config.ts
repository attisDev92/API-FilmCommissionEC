import config from './env.config'

console.log(config.allowedOrigins)

interface CorsConfig {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => void
  credentials: boolean
}

const corsConfig: CorsConfig = {
  origin: function (origin, callback) {
    const originToCheck = origin || ''

    if (
      config.allowedOrigins &&
      config.allowedOrigins.indexOf(originToCheck) !== -1
    ) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true,
}

export default corsConfig
