const express = require("express");
const router = express.Router();
const Op = require("sequelize").Op;

const Booking = require('../models/booking');
const User = require('../models/user');
const House = require('../models/house');

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

router.get('/list', async (req, res) => {
  if (!req.session.passport || !req.session.passport.user) {
    res.status(403).json({ status: 'error', message: 'Unauthorized' })
    return
  }

  const userEmail = req.session.passport.user
  const user = await User.findOne({ where: { email: userEmail } })

  Booking.findAndCountAll({
    where: {
      paid: true,
      userId: user.id,
      endDate: {
        [Op.gte]: new Date()
      }
    },
    order: [['startDate', 'ASC']]
  }).then(async result => {
    const bookings = await Promise.all(
      result.rows.map(async booking => {
        const data = {}
        data.booking = booking.dataValues
        data.house = (await House.findByPk(data.booking.houseId)).dataValues
        return data
      })
    )
    res.json(bookings);
  })
})

module.exports = router;