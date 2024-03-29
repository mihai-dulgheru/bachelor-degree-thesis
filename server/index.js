'use strict'

const cors = require('cors')
const express = require('express')
const path = require('path')
const alternativesRouter = require('./routes/alternativesRouter')
const apiRouter = require('./routes/apiRouter')
const authRouter = require('./routes/authRouter')
const googleAuthRouter = require('./routes/googleAuthRouter')
const sequelize = require('./sequelize')
const bodyParser = require('body-parser')
const { config } = require('dotenv')
config({})
const port = process.env.PORT || 8080

const Device = require('./models/device')
const Prize = require('./models/prize')
const User = require('./models/user')
const UserDevice = require('./models/user-device')
const UserPrize = require('./models/user-prize')

User.belongsToMany(Device, { through: UserDevice })
Device.belongsToMany(User, { through: UserDevice })
User.hasMany(Prize)
Prize.belongsToMany(User, { through: UserPrize })

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

app.get('/sync', async (_req, res, next) => {
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
app.use('/alternatives', alternativesRouter)
app.use('/api/google/auth', googleAuthRouter)

app.use((err, _req, res, _next) => {
  console.error(`[ERROR]: ${err}`)
  res.status(500).json(err)
})

app.listen(port, async () => {
  console.log(`Server started on http://localhost:${port}`)
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})
