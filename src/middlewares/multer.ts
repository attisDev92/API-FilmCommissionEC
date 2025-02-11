import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'

const uploadTempFiles = multer({
  storage: multer.memoryStorage(),
  fileFilter: (
    _req: Request,
    _file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    cb(null, true)
  },
  limits: { fileSize: 5 * 1024 * 1024 },
})

export default uploadTempFiles
