const express = require('express')
const next = require('next')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const User = require('./model').User
const sequelize = require('./model').sequelize

const sessionStore = new SequelizeStore({ db: sequelize, tableName: 'sessions' })
// sessionStore.sync()

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const server = express()

  server.use(session({
    secret: '2d0fdcee-c721-42ea-a796-7cfe85221b9a',
    resave: false,
    saveUninitialized: true,
    name: 'nextbnb',
    cookie: {
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    },
    store: sessionStore
  }))

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