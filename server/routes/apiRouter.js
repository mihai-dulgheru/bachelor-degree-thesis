const User = require('../models/user')
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
          accessToken,
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

apiRouter.route('/users').post(async (req, res, next) => {
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

module.exports = apiRouter
