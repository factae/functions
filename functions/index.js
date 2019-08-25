const functions = require('firebase-functions')

exports.generatePdf = functions.https.onCall(require('./generatePdf'))
exports.charge = functions.https.onCall(require('./charge'))
exports.sendMail = functions.https.onCall(require('./sendMail'))
