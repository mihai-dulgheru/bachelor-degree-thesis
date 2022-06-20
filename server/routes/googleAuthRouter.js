const googleAuthRouter = require('express').Router()
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)

googleAuthRouter.route('/tokeninfo').post(async (req, res, next) => {
  try {
    const { token } = req.body
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
    })
    const payload = ticket.getPayload()
    res.status(201).json(payload)
  } catch (err) {
    next(err)
  }
})

module.exports = googleAuthRouter
