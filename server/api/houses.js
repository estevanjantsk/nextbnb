const express = require("express");

const House = require("../models/house");
const Review = require("../models/review");

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