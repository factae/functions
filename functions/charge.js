const {DateTime} = require('luxon')
const Stripe = require('stripe')
const admin = require('firebase-admin')

const firestore = admin.initializeApp().firestore()
const stripe = new Stripe(String(process.env.STRIPE_API_KEY))

async function charge({userId, token}) {
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
}

module.exports = charge
