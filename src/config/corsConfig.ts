import config from './envConfig'

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
    if (
      (config.allowedOrigins && config.allowedOrigins.indexOf(origin) !== -1) ||
      !origin
    ) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true,
}

export default corsConfig
