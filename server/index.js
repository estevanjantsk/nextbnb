const express = require('express')
const next = require('next')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const sequelize = require('./database')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload')

require('dotenv').config()

const User = require('./models/user')
const House = require('./models/house')
const Review = require('./models/review')
const Booking = require('./models/booking')

User.sync({ alter: true })
House.sync({ alter: true })
Review.sync({ alter: true })
Booking.sync({ alter: true })

const apiAuth = require('./api/auth')
const apiHouses = require('./api/houses')
const apiStripe = require('./api/stripe')
const apiBookings = require('./api/bookings')
const apiHost = require('./api/host')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async function (email, password, done) {
  const user = await User.findOne({ where: { email: email } })

  if (!user) {
    done('User not found', null)
    return
  }

  const valid = await user.isPasswordValid(password)

  if (!valid) {
    done('Email and password do not match', null)
    return
  }

  done(null, user)
}))
passport.serializeUser((user, done) => {
  done(null, user.email)
})
passport.deserializeUser((email, done) => {
  User.findOne({ where: { email: email } }).then((user) => {
    done(null, user)
  })
})

const sessionStore = new SequelizeStore({ db: sequelize, tableName: 'sessions' })
// sessionStore.sync()

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const server = express()

  server.use(
    bodyParser.json({
      verify: (req, res, buf) => {
        req.rawBody = buf;
      }
    }),
    session({
      secret: '2d0fdcee-c721-42ea-a796-7cfe85221b9a',
      resave: false,
      saveUninitialized: true,
      name: 'nextbnb',
      cookie: {
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      },
      store: sessionStore
    }),
    passport.initialize(),
    passport.session(),
    fileupload()
  )

  server.use("/api/auth", apiAuth);
  server.use("/api/houses", apiHouses);
  server.use("/api/stripe", apiStripe);
  server.use("/api/bookings", apiBookings);
  server.use("/api/host", apiHost);

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`)
  })
})