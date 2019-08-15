# Functions

This repo contains the serverless part of factAE, based on [Firebase Cloud
Functions](https://firebase.google.com/docs/functions). Functions are located
in `functions/index.js`.

## generatePdf

Generates a PDF document based on a document object sent as input. You can see
an example in `functions/pug.config.js`.

## charge

Validates a [Stripe](https://stripe.com) payment. The `STRIPE_API_KEY` env var
is required to validate the transaction.
