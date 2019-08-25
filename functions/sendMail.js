const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_HOST,
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS,
  },
})

async function sendMail(options) {
  await transporter.sendMail(options)
}

module.exports = sendMail
