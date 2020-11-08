const express = require("express");

const House = require("../models/house");
const Review = require("../models/review");
const User = require("../models/user");
const Booking = require("../models/booking");

const router = express.Router();

router.get('/', async (req, res) => {

  House.findAndCountAll()
    .then(result => {
      const houses = result.rows;

      res.json({ status: 'success', data: houses })
    })
    .catch(reason => {
      res.status(500).json({ status: 'error', message: reason })
    })
});

router.post('/reserve', async (req, res) => {
  const userEmail = req.session.passport.user
  try {
    const user = await User.findOne({ where: { email: userEmail } })
    await Booking.create({
      houseId: req.body.houseId,
      userId: user.id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    })
    res.json({ status: 'success', message: 'ok' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'not possible to reserve' })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  House.findByPk(id, { include: { model: Review } })
    .then(house => {
      if (!house) {
        res.status(404).json({ status: 'error', message: 'Not found' })
        return
      }
      house.setDataValue('reviewsCount', house.reviews.length)
      res.json({ status: 'success', data: house })
    })
    .catch(reason => {
      res.status(500).json({ status: 'error', message: reason.message })
    })
});

module.exports = router;