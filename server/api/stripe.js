const express = require("express");
const router = express.Router();
const Booking = require('../models/booking');

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

router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  }
  catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const sessionId = event.data.object.id

    try {
      await Booking.update({ paid: true }, { where: { sessionId } })
    } catch (err) {
      console.error(err)
    }
  }

  // Return a res to acknowledge receipt of the event
  res.json({ received: true });
})

module.exports = router;