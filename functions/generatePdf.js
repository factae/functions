const {DateTime} = require('luxon')
const TeaSchool = require('tea-school')
const path = require('path')

function formatDate(dateISO) {
  if (!dateISO) return null
  return DateTime.fromISO(dateISO).toFormat('dd/LL/yyyy')
}

async function generatePdf(htmlTemplateOptions) {
  const theme = process.env.THEME || htmlTemplateOptions.profile.documentsTheme || 'default'

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
}

module.exports = generatePdf
