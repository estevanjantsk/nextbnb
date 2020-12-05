const express = require("express");
const sanitizeHtml = require('sanitize-html');
const randomstring = require('randomstring');
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

router.post('/new', async (req, res) => {
  const houseData = req.body.house

  if (!req.session.passport) {
    res.status(403).json({ status: 'error', message: 'Unauthorized' })
    return
  }

  const userEmail = req.session.passport.user

  const user = await User.findOne({ where: { email: userEmail } })
  houseData.host = user.id
  houseData.description = sanitizeHtml(houseData.description, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br']
  })

  await House.create(houseData)

  res.json({ status: 'success', message: 'ok' })
})

router.post('/edit', async (req, res) => {
  const houseData = req.body.house

  if (!req.session.passport) {
    res.status(403).json({ status: 'error', message: 'Unauthorized' })
    return
  }

  const userEmail = req.session.passport.user

  const user = await User.findOne({ where: { email: userEmail } })
  const house = await House.findByPk(houseData.id)
  if (house) {
    if (house.host !== user.id) {
      res.status(403).json({ status: 'error', message: 'Unauthorized' })
      return
    }
    houseData.description = sanitizeHtml(houseData.description, {
      allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br']
    })
    try {
      await House.update(houseData, {
        where: {
          id: houseData.id
        }
      })
      res.json({ status: 'success', message: 'ok' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.name })
    }
  }
})

router.post('/image', (req, res) => {
  if (!req.session.passport) {
    res.status(403).json({ status: 'error', message: 'Unauthorized' })
    return
  }

  const image = req.files.image
  const fileName = randomstring.generate(7) + image.name.replace(/\s/g, '')
  const path = __dirname + '/public/img/houses/' + fileName

  image.mv(path, error => {
    if (error) {
      res.status(500).json({ status: 'error', message: error })
      return
    }

    res.json({ status: 'success', path: '/img/houses/' + fileName });
  })
})

module.exports = router;