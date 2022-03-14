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

apiRouter
  .route('/users/:id/devices')
  .get(async (req, res, next) => {
    try {
      // TODO
    } catch (err) {
      next(err)
    }
  })
  .post(async (req, res, next) => {
    try {
      // TODO
    } catch (err) {
      next(err)
    }
  })

apiRouter
  .route('/users/:userId/devices/:deviceId')
  .get(async (req, res, next) => {
    try {
      // TODO
    } catch (err) {
      next(err)
    }
  })
  .put(async (req, res, next) => {
    try {
      // TODO
    } catch (err) {
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      // TODO
    } catch (err) {
      next(err)
    }
  })

module.exports = apiRouter
