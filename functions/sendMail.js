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
  if (options.from === 'demo@factae.fr') {
    throw new Error()
  } else {
    await transporter.sendMail(options)
  }
}

module.exports = sendMail
