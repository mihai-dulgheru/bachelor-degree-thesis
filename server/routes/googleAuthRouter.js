const googleAuthRouter = require('express').Router()
const { OAuth2Client } = require('google-auth-library')
const CLIENT_ID = '64113970239-gi8kgn6512hdar4ei0140d8235qqf92l.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID)

googleAuthRouter.route('/tokeninfo').post(async (req, res, next) => {
  try {
    const { token } = req.body
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    })
    const payload = ticket.getPayload()
    res.status(201).json(payload)
  } catch (err) {
    next(err)
  }
})

module.exports = googleAuthRouter
