const Device = require('../models/device')
const User = require('../models/user')
const authRouter = require('express').Router()

authRouter.use(async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      where: {
        token: req.headers.authorization
      }
    })
    if (user) {
      next()
    } else {
      res.status(403).json({
        status: 'error',
        message: 'Access Token Invalid'
      })
    }
  } else {
    res.status(401).json({
      status: 'error',
      message: 'No Authorization Header'
    })
  }
})

authRouter
  .route('/user')
  .get(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          token: req.headers.authorization
        }
      })
      const { password, token, ...tempUser } = user.dataValues
      res.status(200).json({
        status: 'ok',
        user: tempUser
      })
    } catch (err) {
      next(err)
    }
  })
  .put(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          token: req.headers.authorization
        }
      })
      await user.update(req.body)
      const { password, token, ...tempUser } = user.dataValues
      res.status(200).json({
        status: 'ok',
        message: `User with ID = ${tempUser.id} is updated`,
        user: tempUser
      })
    } catch (err) {
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          token: req.headers.authorization
        }
      })
      const id = user.id
      await user.destroy()
      res.status(200).json({
        status: 'ok',
        message: `User with ID = ${id} is deleted`
      })
    } catch (err) {
      next(err)
    }
  })

authRouter.route('/devices').get(async (req, res, next) => {
  try {
    const devices = await Device.findAll({
      attributes: { exclude: ['id'] }
    })
    const deviceCollection = []
    for (const device of devices) {
      const item = {
        value: `${device.dataValues.deviceType},${device.dataValues.energyClass},${device.dataValues.consumption},${device.dataValues.noWorkingHours}`,
        label: `${device.dataValues.deviceType}, ${device.dataValues.energyClass}, ${device.dataValues.consumption} kWh, ${device.dataValues.noWorkingHours} h`
      }
      if (!deviceCollection.some((element) => element.value === item.value)) {
        deviceCollection.push(item)
      }
    }
    res.status(200).json({
      status: 'ok',
      devices: deviceCollection
    })
  } catch (err) {
    next(err)
  }
})

authRouter.route('/user/devices').post(async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        token: req.headers.authorization
      }
    })
    if (req.body.consumption && req.body.noWorkingHours && req.body.energyClass && req.body.deviceType) {
      const device = await Device.create(req.body)
      await user.addDevice(device)
      res.status(200).json({
        status: 'ok',
        message: `Device with ID = ${device.id} is created`,
        device: device
      })
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Missing fields (consumption, noWorkingHours, energyClass and/or deviceType)'
      })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = authRouter
