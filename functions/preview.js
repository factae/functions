const path = require('path')
const fs = require('fs')

const generatePdf = require('./generatePdf')
const data = require('./pug.config').locals

const theme = process.env.THEME || 'default'
const preview = path.resolve(__dirname, 'themes', theme, 'preview.pdf')

generatePdf(data)
  .then(blob => fs.writeFileSync(preview, blob, 'base64'))
  .catch(error => console.error(error))
