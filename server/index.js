'use strict'

const cors = require('cors')
const express = require('express')
const path = require('path')
const apiRouter = require('./routes/apiRouter')
const authRouter = require('./routes/authRouter')
const sequelize = require('./sequelize')
const bodyParser = require('body-parser')
const { config } = require('dotenv')
config({})
const port = process.env.PORT || 8080

const Device = require('./models/device')
const Prize = require('./models/prize')
const User = require('./models/user')
const UserDevice = require('./models/user-device')

// Associations
User.belongsToMany(Device, { through: UserDevice })
Device.belongsToMany(User, { through: UserDevice })
User.hasMany(Prize)

const app = express()

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: '*',
    optionsSuccessStatus: 200
  })
)
app.use(express.static(path.join(path.resolve(), 'public')))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.get('/sync', async (req, res, next) => {
  try {
    sequelize.sync({ force: true }).then(() => {
      console.log('All models were synchronized successfully')
    })
    res.status(200).json({ message: 'All models were synchronized successfully' })
  } catch (error) {
    next(error)
  }
})

app.use('/api', apiRouter)
app.use('/api/auth', authRouter)

app.use((err, req, res, next) => {
  console.error(`[ERROR]: ${err}`)
  res.status(500).json(err)
})

app.listen(port, async () => {
  console.log(`Server started on http://localhost:${port}`)
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully!')
  } catch (err) {
    console.error('Unable to connect to the database: ', err)
  }
})
