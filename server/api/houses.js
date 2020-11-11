const express = require("express");
const Op = require("sequelize").Op;

const House = require("../models/house");
const Review = require("../models/review");
const User = require("../models/user");
const Booking = require("../models/booking");

const getDatesBetweenDates = (startDate, endDate) => {
  let dates = []
  while (startDate < endDate) {
    dates = [...dates, new Date(startDate)]
    startDate.setDate(startDate.getDate() + 1)
  }
  dates = [...dates, endDate]
  return dates
}

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

router.post('/booked', async (req, res) => {
  const houseId = req.body.houseId

  try {
    const results = await Booking.findAll({
      where: {
        houseId: houseId,
        endDate: {
          [Op.gte]: new Date()
        }
      }
    })
    let bookedDates = [];
    for (const result of results) {
      const dates = getDatesBetweenDates(
        new Date(result.startDate),
        new Date(result.endDate)
      )

      bookedDates = [...bookedDates, ...dates]
    }
    bookedDates = [...new Set(bookedDates.map(date => date))]

    res.json({ status: 'success', dates: bookedDates })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'not possible to get booked dates' })
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