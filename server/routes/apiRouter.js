const User = require('../models/user')
const Device = require('../models/device')
const apiRouter = require('express').Router()
const crypto = require('crypto')

apiRouter.route('/login').post(async (req, res, next) => {
  try {
    if (req.body.username && req.body.password) {
      const user = await User.findOne({
        where: { username: req.body.username, password: req.body.password },
        attributes: { exclude: ['password'] }
      })
      if (user) {
        const { password, token, ...tempUser } = user.dataValues
        const accessToken = crypto.randomBytes(64).toString('hex')
        const response = {
          status: 'ok',
          message: 'Logged in',
          accessToken: accessToken,
          user: tempUser
        }
        user.token = accessToken
        await user.save()
        res.status(200).json(response)
      } else {
        res.status(401).json({
          status: 'error',
          message: 'Login failed'
        })
      }
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Missing username and/or password'
      })
    }
  } catch (err) {
    next(err)
  }
})

apiRouter
  .route('/users')
  .get(async (req, res, next) => {
    try {
      const users = await User.findAll()
      const tempUsers = []
      for (const user of users) {
        const { password, token, ...tempUser } = user.dataValues
        tempUsers.push(tempUser)
      }
      res.status(200).json(tempUsers)
    } catch (err) {
      next(err)
    }
  })
  .post(async (req, res, next) => {
    try {
      if (req.body.firstName && req.body.lastName && req.body.username && req.body.password && req.body.email) {
        const newUser = await User.create(req.body)
        const { password, token, ...tempUser } = newUser.dataValues
        res.status(200).json({
          status: 'ok',
          message: `User with ID = ${newUser.id} is created`,
          user: tempUser
        })
      } else {
        res.status(400).json({
          status: 'error',
          message: 'Missing fields (firstName, lastName, username, password and/or email)'
        })
      }
    } catch (err) {
      next(err)
    }
  })

apiRouter
  .route('/users/:id')
  .get(async (req, res, next) => {
    try {
      const id = parseInt(req.params.id)
      const user = await User.findByPk(id)
      if (user) {
        const { password, token, ...tempUser } = user.dataValues
        res.status(200).json({
          status: 'ok',
          user: tempUser
        })
      } else {
        res.status(404).json({
          status: 'error',
          message: `User with ID = ${id} not found`
        })
      }
    } catch (err) {
      next(err)
    }
  })
  .put(async (req, res, next) => {
    try {
      const id = parseInt(req.params.id)
      const user = await User.findByPk(id)
      if (user) {
        await user.update(req.body)
        const { password, token, ...tempUser } = user.dataValues
        res.status(200).json({
          status: 'ok',
          message: `User with ID = ${id} is updated`,
          user: tempUser
        })
      } else {
        res.status(404).json({
          status: 'error',
          message: `User with ID = ${id} not found`
        })
      }
    } catch (err) {
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      const id = parseInt(req.params.id)
      const user = await User.findByPk(id)
      if (user) {
        await user.destroy()
        res.status(200).json({
          status: 'ok',
          message: `User with ID = ${id} is deleted`
        })
      } else {
        res.status(404).json({
          status: 'error',
          message: `User with ID = ${id} not found`
        })
      }
    } catch (err) {
      next(err)
    }
  })

apiRouter.route('/devices').get(async (req, res, next) => {
  try {
    const devices = await Device.findAll()
    res.status(200).json(devices)
  } catch (err) {
    next(err)
  }
})

apiRouter
  .route('/users/:id/devices')
  .get(async (req, res, next) => {
    try {
      const id = parseInt(req.params.id)
      const user = await User.findByPk(id, { include: Device })
      if (user) {
        const devices = user.Devices
        const tempDevices = []
        for (const device of devices) {
          const { User_Device, ...tempDevice } = device.dataValues
          tempDevices.push(tempDevice)
        }
        res.status(200).json(tempDevices)
      } else {
        res.status(404).json({
          status: 'error',
          message: `User with ID = ${id} not found`
        })
      }
    } catch (err) {
      next(err)
    }
  })
  .post(async (req, res, next) => {
    try {
      const id = parseInt(req.params.id)
      const user = await User.findByPk(id)
      if (user) {
        if (
          req.body.energyConsumption &&
          req.body.unitMeasurement &&
          req.body.noOperatingHours &&
          req.body.efficiencyClass &&
          req.body.category
        ) {
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
            message:
              'Missing fields (energyConsumption, unitMeasurement, noOperatingHours, efficiencyClass and/or category)'
          })
        }
      } else {
        res.status(404).json({
          status: 'error',
          message: `User with ID = ${id} not found`
        })
      }
    } catch (err) {
      next(err)
    }
  })

apiRouter
  .route('/users/:userId/devices/:deviceId')
  .get(async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId)
      const user = await User.findByPk(userId, { include: Device })
      if (user) {
        const devices = user.Devices
        const deviceId = parseInt(req.params.deviceId)
        const device = devices.map((element) => element.dataValues).find((element) => element.id === deviceId)
        if (device) {
          res.status(200).json({
            status: 'ok',
            device: {
              id: device.id,
              energyConsumption: device.energyConsumption,
              unitMeasurement: device.unitMeasurement,
              noOperatingHours: device.noOperatingHours,
              efficiencyClass: device.efficiencyClass,
              category: device.category
            }
          })
        } else {
          res.status(404).json({
            status: 'error',
            message: `Device with ID = ${deviceId} not found`
          })
        }
      } else {
        res.status(404).json({
          status: 'error',
          message: `User with ID = ${userId} not found`
        })
      }
    } catch (err) {
      next(err)
    }
  })
  .put(async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId)
      const user = await User.findByPk(userId, { include: Device })
      if (user) {
        const devices = user.Devices
        const deviceId = parseInt(req.params.deviceId)
        const device = devices.map((element) => element.dataValues).find((element) => element.id === deviceId)
        if (device) {
          const updatedDevice = await Device.findByPk(deviceId)
          await updatedDevice.update(req.body)
          res.status(200).json({
            status: 'ok',
            message: `Device with ID = ${deviceId} is updated`,
            device: {
              id: updatedDevice.id,
              energyConsumption: updatedDevice.energyConsumption,
              unitMeasurement: updatedDevice.unitMeasurement,
              noOperatingHours: updatedDevice.noOperatingHours,
              efficiencyClass: updatedDevice.efficiencyClass,
              category: updatedDevice.category
            }
          })
        } else {
          res.status(404).json({
            status: 'error',
            message: `Device with ID = ${deviceId} not found`
          })
        }
      } else {
        res.status(404).json({
          status: 'error',
          message: `User with ID = ${userId} not found`
        })
      }
    } catch (err) {
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId)
      const user = await User.findByPk(userId, { include: Device })
      if (user) {
        const devices = user.Devices
        const deviceId = parseInt(req.params.deviceId)
        const device = devices.map((element) => element.dataValues).find((element) => element.id === deviceId)
        if (device) {
          await (await Device.findByPk(deviceId)).destroy()
          res.status(200).json({
            status: 'ok',
            message: `Device with ID = ${deviceId} is deleted`
          })
        } else {
          res.status(404).json({
            status: 'error',
            message: `Device with ID = ${deviceId} not found`
          })
        }
      } else {
        res.status(404).json({
          status: 'error',
          message: `User with ID = ${userId} not found`
        })
      }
    } catch (err) {
      next(err)
    }
  })

module.exports = apiRouter
