const express = require("express");

const House = require("../models/house");

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

module.exports = router;