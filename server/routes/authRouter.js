const Device = require('../models/device')
const User = require('../models/user')
const Prize = require('../models/prize')
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

authRouter.route('/devices').get(async (_req, res, next) => {
  try {
    const devices = await Device.findAll({
      attributes: { exclude: ['id'] }
    })
    const deviceCollection = []
    for (const device of devices) {
      const item = {
        value: `${device.dataValues.category};${device.dataValues.efficiencyClass};${device.dataValues.energyConsumption};${device.dataValues.unitMeasurement};${device.dataValues.noOperatingHours}`,
        label: `${device.dataValues.category}${
          device.dataValues.efficiencyClass ? ', ' + device.dataValues.efficiencyClass : ''
        }, ${device.dataValues.energyConsumption} ${device.dataValues.unitMeasurement}, ${
          device.dataValues.noOperatingHours
        } h/day`
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
        const { UserDevice, ...tempDevice } = device.dataValues
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
      if (req.body.energyConsumption && req.body.unitMeasurement && req.body.noOperatingHours && req.body.category) {
        const device = await Device.create(req.body)
        await user.addDevice(device)
        res.status(200).json({
          status: 'ok',
          message: `Device with ID = ${device.id} is created`,
          device
        })
      } else {
        res.status(400).json({
          status: 'error',
          message: 'Missing fields (energyConsumption, unitMeasurement, noOperatingHours and/or category)'
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
            category: device.category,
            previousVersion: device.previousVersion
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
        const previousVersion =
          req.body.previousVersion !== undefined
            ? req.body.previousVersion
            : `${updatedDevice.energyConsumption};${updatedDevice.unitMeasurement};${updatedDevice.efficiencyClass}`
        await updatedDevice.update({ ...req.body, previousVersion })
        res.status(200).json({
          status: 'ok',
          message: `Device with ID = ${deviceId} is updated`,
          device: {
            id: updatedDevice.id,
            energyConsumption: updatedDevice.energyConsumption,
            unitMeasurement: updatedDevice.unitMeasurement,
            noOperatingHours: updatedDevice.noOperatingHours,
            efficiencyClass: updatedDevice.efficiencyClass,
            category: updatedDevice.category,
            previousVersion: updatedDevice.previousVersion
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

authRouter.route('/prizes').get(async (_req, res, next) => {
  try {
    const prizes = await Prize.findAll({
      attributes: { exclude: ['id'] }
    })
    res.status(200).json({
      status: 'ok',
      prizes
    })
  } catch (err) {
    next(err)
  }
})

authRouter
  .route('/user/prizes')
  .get(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          token: req.headers.authorization
        },
        include: Prize
      })
      const prizes = user.Prizes
      const tempPrizes = []
      for (const prize of prizes) {
        const { UserPrize, UserId, ...tempPrize } = prize.dataValues
        tempPrizes.push(tempPrize)
      }
      res.status(200).json({
        status: 'ok',
        prizes: tempPrizes
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
      if (req.body.prizeType && req.body.prizeValue) {
        const prize = await Prize.create(req.body)
        await user.addPrize(prize)
        res.status(200).json({
          status: 'ok',
          message: `Prize with ID = ${prize.id} is created`,
          prize
        })
      } else {
        res.status(400).json({
          status: 'error',
          message: 'Missing fields (prizeType and/or prizeValue)'
        })
      }
    } catch (err) {
      next(err)
    }
  })

authRouter
  .route('/user/prizes/:prizeId')
  .get(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          token: req.headers.authorization
        },
        include: Prize
      })
      const prizes = user.Prizes
      const prizeId = parseInt(req.params.prizeId)
      const prize = prizes.map((element) => element.dataValues).find((element) => element.id === prizeId)
      if (prize) {
        res.status(200).json({
          status: 'ok',
          prize: {
            id: prize.id,
            prizeType: prize.prizeType,
            prizeValue: prize.prizeValue
          }
        })
      } else {
        res.status(404).json({
          status: 'error',
          message: `Prize with ID = ${prizeId} not found`
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
        include: Prize
      })
      const prizes = user.Prizes
      const prizeId = parseInt(req.params.prizeId)
      const prize = prizes.map((element) => element.dataValues).find((element) => element.id === prizeId)
      if (prize) {
        const updatedPrize = await Prize.findByPk(prizeId)
        await updatedPrize.update(req.body)
        res.status(200).json({
          status: 'ok',
          message: `Prize with ID = ${prizeId} is updated`,
          prize: {
            id: updatedPrize.id,
            prizeType: updatedPrize.prizeType,
            prizeValue: updatedPrize.prizeValue
          }
        })
      } else {
        res.status(404).json({
          status: 'error',
          message: `Prize with ID = ${prizeId} not found`
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
        include: Prize
      })
      const prizes = user.Prizes
      const prizeId = parseInt(req.params.prizeId)
      const prize = prizes.map((element) => element.dataValues).find((element) => element.id === prizeId)
      if (prize) {
        await (await Prize.findByPk(prizeId)).destroy()
        res.status(200).json({
          status: 'ok',
          message: `Prize with ID = ${prizeId} is deleted`
        })
      } else {
        res.status(404).json({
          status: 'error',
          message: `Prize with ID = ${prizeId} not found`
        })
      }
    } catch (err) {
      next(err)
    }
  })

module.exports = authRouter
