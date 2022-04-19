const alternativesRouter = require('express').Router()
const puppeteer = require('puppeteer')

alternativesRouter.route('/').get(async (req, res, next) => {
  const { url } = req.query
  try {
    if (url) {
      const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-extensions']
      })
      const page = await browser.newPage()
      await page.goto(url)
      const data = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#card_grid > div > div > div')).map((element) => {
          return {
            name: element.childNodes[3].childNodes[2].childNodes[1].textContent,
            price: parseFloat(
              element.childNodes[5].childNodes[0].childNodes[1].textContent
                .split(' ')[0]
                .replace('.', '')
                .replace(',', '.')
            ),
            link: element.childNodes[3].childNodes[2].childNodes[1].href
          }
        })
      })
      await browser.close()
      res.status(200).json({
        status: 'ok',
        data: data
      })
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Missing parameter url'
      })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = alternativesRouter
