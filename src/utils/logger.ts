interface InfoFunction {
  (...params: any[]): void
}

export const info: InfoFunction = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

interface LogFunction {
  (...params: any[]): void
}

export const error: LogFunction = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}
