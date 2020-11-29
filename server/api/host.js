const express = require("express");
const router = express.Router();
const Op = require("sequelize").Op;

const Booking = require('../models/booking');
const User = require('../models/user');
const House = require('../models/house');

router.get('/list', async (req, res) => {
  if (!req.session.passport || !req.session.passport.user) {
    res.status(403).json({ status: 'error', message: 'Unauthorized' })
    return
  }

  const userEmail = req.session.passport.user
  const user = await User.findOne({ where: { email: userEmail } })

  const houses = await House.findAll({
    where: {
      host: user.id
    }
  })
  const houseIds = houses.map(house => house.dataValues.id)

  const bookingsData = await Booking.findAll({
    where: {
      paid: true,
      houseId: {
        [Op.in]: houseIds
      },
      endDate: {
        [Op.gte]: new Date()
      }
    },
    order: [['startDate', 'ASC']]
  })

  const bookings = await Promise.all(
    bookingsData.map(async booking => {
      return {
        booking: booking.dataValues,
        house: houses.filter(
          house => house.dataValues.id === booking.dataValues.houseId
        )[0].dataValues
      }
    })
  )

  res.json({
    bookings,
    houses
  });
})

module.exports = router;