const express = require("express");
const router = express.Router();
const Booking = require('../models/booking');

router.post('/clean', (req, res) => {

  Booking.destroy({
    where: {
      paid: false
    }
  })

  res.json({
    status: 'success',
    message: 'ok'
  })
});

module.exports = router;