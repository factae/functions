const {DateTime} = require('luxon')
const TeaSchool = require('tea-school')
const path = require('path')
const intl = require('intl')

function formatDate(dateISO) {
  if (!dateISO) return null
  return DateTime.fromISO(dateISO).toFormat('dd/LL/yyyy')
}

function formatNumber(number) {
  return intl
    .NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'})
    .format(Number(number))
    .replace(/\u202F/g, ' ')
}

function formatUnit(unit) {
  switch (unit) {
    case 'unit-hour':
      return 'heure'
    case 'unit-day':
      return 'jour'
    case 'unit-delivery':
      return 'service'
    default:
    case 'unit-unit':
      return 'unité'
  }
}

async function generatePdf(data) {
  const theme = process.env.THEME || data.profile.documentsTheme || 'default'

  data.document.subtotal = formatNumber(data.document.subtotal)
  data.document.totalDiscount = formatNumber(data.document.totalDiscount)
  data.document.totalHT = formatNumber(data.document.totalHT)
  data.document.totalTVA = formatNumber(data.document.totalTVA)
  data.document.totalTTC = formatNumber(data.document.totalTTC)
  data.document.items = data.document.items.map(i => {
    i.unitPrice = formatNumber(i.unitPrice)
    i.amount = formatNumber(i.amount)
    i.unit = formatUnit(i.unit)
    return i
  })

  data.document.createdAt = formatDate(data.document.createdAt)
  data.document.paymentDeadlineAt = formatDate(data.document.paymentDeadlineAt)

  const htmlTemplatePath = path.resolve(__dirname, 'themes', theme, 'template.pug')

  const styleOptions = {
    file: path.resolve(__dirname, 'themes', theme, 'styles.scss'),
  }

  const pdfOptions = {
    filename: data.document.number + '.pdf',
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
    htmlTemplateOptions: data,
    htmlTemplatePath,
    styleOptions,
    pdfOptions,
    puppeteerOptions,
  }

  const buffer = await TeaSchool.generatePdf(teaSchoolOptions)
  return buffer.toString('base64')
}

module.exports = generatePdf
