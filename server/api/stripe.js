const express = require("express");

const router = express.Router();

router.post('/session', async (req, res) => {
  const amount = req.body.amount

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        name: 'Booking house on Airbnb clone',
        amount: amount * 100,
        currency: 'usd',
        quantity: 1
      }
    ],
    success_url: process.env.BASE_URL + '/bookings',
    cancel_url: process.env.BASE_URL + '/bookings'
  })

  res.json({
    status: 'success',
    sessionId: session.id,
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY
  })
});

module.exports = router;