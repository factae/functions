const functions = require('firebase-functions')
const {DateTime} = require('luxon')
const TeaSchool = require('tea-school')
const Stripe = require('stripe')
const admin = require('firebase-admin')
const nodemailer = require('nodemailer')
const path = require('path')

const firestore = admin.initializeApp().firestore()
const stripe = new Stripe(String(process.env.STRIPE_API_KEY))
const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_HOST,
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS,
  },
})

function formatDate(dateISO) {
  if (!dateISO) return null
  return DateTime.fromISO(dateISO).toFormat('dd/LL/yyyy')
}

exports.generatePdf = functions.https.onCall(async htmlTemplateOptions => {
  const theme = htmlTemplateOptions.theme || 'default'

  htmlTemplateOptions.document.createdAt = formatDate(htmlTemplateOptions.document.createdAt)
  htmlTemplateOptions.document.paymentDeadlineAt = formatDate(
    htmlTemplateOptions.document.paymentDeadlineAt,
  )

  const htmlTemplatePath = path.resolve(__dirname, 'themes', theme, 'template.pug')

  const styleOptions = {
    file: path.resolve(__dirname, 'themes', theme, 'styles.scss'),
  }

  const pdfOptions = {
    filename: htmlTemplateOptions.document.number + '.pdf',
    format: 'A4',
    displayHeaderFooter: true,
    margin: {top: '80px', right: '80px', bottom: '80px', left: '80px'},
    headerTemplate: '<span></span>',
  }

  const puppeteerOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }

  const teaSchoolOptions = {
    htmlTemplatePath,
    htmlTemplateOptions,
    styleOptions,
    pdfOptions,
    puppeteerOptions,
  }

  const buffer = await TeaSchool.generatePdf(teaSchoolOptions)
  return buffer.toString('base64')
})

exports.charge = functions.https.onCall(async ({userId, token}) => {
  const userDoc = firestore.collection('users').doc(userId)
  const ref = await userDoc.get()
  const transaction = await stripe.charges.create({
    amount: 1200,
    currency: 'EUR',
    description: 'Abonnement 12 mois factAE',
    receipt_email: ref.data().email,
    source: token,
  })

  if (!transaction.paid) {
    return {success: false, error: transaction.failure_message}
  }

  const createdAt = DateTime.fromSeconds(transaction.created)
  const expiresAt = createdAt.plus({months: 12})
  await userDoc.update({expiresAt: expiresAt.toJSDate()})

  return {success: true, expiresAt: expiresAt.toISO()}
})

exports.sendMail = functions.https.onCall(async options => {
  await transporter.sendMail(options)
})
