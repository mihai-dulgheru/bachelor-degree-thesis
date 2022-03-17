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
        value: `${device.dataValues.category},${device.dataValues.efficiencyClass},${device.dataValues.energyConsumption},${device.dataValues.unitMeasurement},${device.dataValues.noOperatingHours}`,
        label: `${device.dataValues.category}, ${device.dataValues.efficiencyClass}, ${device.dataValues.energyConsumption} ${device.dataValues.unitMeasurement}, ${device.dataValues.noOperatingHours} h / day`
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

authRouter
  .route('/user/devices')
  .get(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          token: req.headers.authorization
        },
        include: Device
      })
      const devices = user.Devices
      const tempDevices = []
      for (const device of devices) {
        const { User_Device, ...tempDevice } = device.dataValues
        tempDevices.push(tempDevice)
      }
      res.status(200).json({
        status: 'ok',
        devices: tempDevices
      })
    } catch (err) {
      next(err)
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          token: req.headers.authorization
        }
      })
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
    } catch (err) {
      next(err)
    }
  })

authRouter
  .route('/user/devices/:deviceId')
  .get(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          token: req.headers.authorization
        },
        include: Device
      })
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
    } catch (err) {
      next(err)
    }
  })
  .put(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          token: req.headers.authorization
        },
        include: Device
      })
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
    } catch (err) {
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          token: req.headers.authorization
        },
        include: Device
      })
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
    } catch (err) {
      next(err)
    }
  })

module.exports = authRouter
