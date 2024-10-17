import nodemailer from 'nodemailer'
import config from '../config/envConfig'

export interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: config.MAIL,
    pass: config.MAIL_PASSWORD,
  },
})

export const sendEmail = async (options: EmailOptions) => {
  try {
    await transporter.sendMail(options)
    console.log('Email enviado correctamente')
  } catch (error) {
    console.error('Error al enviar el mail', error)
  }
}
