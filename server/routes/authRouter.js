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

module.exports = authRouter
