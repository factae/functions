⚠️ *Project archived, due to lack of interest.*

# Functions

This repo contains the serverless part of factAE, based on [Firebase Cloud
Functions](https://firebase.google.com/docs/functions). Functions are located
in `functions/`.

## generatePdf

Generates a PDF document encoded in base64.

To start the HTML preview server: `yarn start`<br />
To build the PDF: `yarn build`

By default, it will use the `default` theme. To change it, add the `THEME` env
var to your commands. Themes available are located in `functions/themes/`.

To submit a new theme:

  - Copy the `functions/themes/default` folder
  - Adjust `template.pug` and `styles.scss`
  - Once ready, build the pdf with `THEME=my-theme yarn build`
  - Propose a [pull request](https://github.com/factae/functions/pulls)

## charge

Validates a [Stripe](https://stripe.com) payment. The `STRIPE_API_KEY` env var
is required to validate the transaction.

## sendMail

Sends a mail via [Mailgun](https://www.mailgun.com/). The env vars
`MAILGUN_HOST`, `MAILGUN_USER` and `MAILGUN_PASS` are required.
