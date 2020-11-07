const express = require("express");
const passport = require("passport");

const User = require("../models/user");

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, passwordconfirmation } = req.body;

	if (password !== passwordconfirmation) {
		res.status(500).json({ status: 'error', message: 'passwords do not match' })
		return
	}

	try {
		const user = await User.create({ email, password })

		req.login(user, err => {
			if (err) {
				res.status(500).json({ status: 'error', message: err })
				return
			}
			res.json({ status: 'success', message: 'user added' })
		})
	} catch (error) {
		let message = 'An error occurred'
		if (error.name === 'SequelizeUniqueConstraintError') {
			message = 'User already exists'
		}
		res.status(500).json({ status: 'error', message })
	}
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(500).json({ status: 'error', message: 'Email and password required' })
    return
  }

  passport.authenticate('local', (err, user) => {
    if (err) {
      res.status(500).json({ status: 'error', message: err })
      return
    }

    if (!user) {
      res.status(500).json({ status: 'error', message: 'No user matching credentials' })
      return
    }

    req.login(user, err => {
      if (err) {
        res.status(500).json({ status: 'error', message: err })
        return
      }

      return res.json({ status: 'success', message: 'logged in' })
    })
  })(req, res, next)
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()

  res.json({ status: 'success', message: 'logged out' })
})

module.exports = router;