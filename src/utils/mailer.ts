import nodemailer from 'nodemailer'
import config from '../config/env.config'

export interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.MAIL,
    pass: config.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
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
