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
          if (element.childNodes[3].childNodes[2].childNodes[1] && element.childNodes[5].childNodes[0].childNodes[1]) {
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

alternativesRouter.route('/one').get(async (req, res, next) => {
  const { url } = req.query
  const reSpecifications =
    /(.*\W|^)(kWh|W|kW|Clasa energetica|Clasa energetica potrivit noilor etichete energetice adoptate la nivelul UE)(\W.*|$)/g
  const reEnergyConsumption = /(.*\W|^)(Consum energie electrica|Consum anual energie|Consum de energie)(\W.*|$)/g
  try {
    if (url) {
      const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-extensions']
      })
      const page = await browser.newPage()
      await page.goto(url)
      const found = (await page.content()).match(reSpecifications)
      const data = {
        energyConsumption: 0,
        unitMeasurement: '',
        efficiencyClass: ''
      }
      if (found) {
        const extractedText = await page.$eval('*', (element) => element.innerText)
        const specifications = extractedText
          ? extractedText.split('\n').filter((element) => element.match(reSpecifications))
          : []
        const specificationEnergyConsumption = specifications.find((item) => {
          return item.match(reEnergyConsumption) && item.match(/^((?!Consum de energie pe zi).)*$/g)
        })
        data.energyConsumption = specificationEnergyConsumption
          ? parseInt(specificationEnergyConsumption.split('\t')[1].split(' ')[0])
          : 0
        data.unitMeasurement = specificationEnergyConsumption
          ? specificationEnergyConsumption.split('\t')[1].split(' ')[1]
          : ''
        if (data.unitMeasurement === 'kWh') {
          if (specificationEnergyConsumption.includes('/')) {
            const um = specificationEnergyConsumption.split('/')[1].split('\t')[0].trim()
            switch (um) {
              case '1000 ore':
                data.unitMeasurement += '/1000h'
                break
              case '100 spalari':
                data.unitMeasurement += '/100 cycles'
                break

              default:
                break
            }
          } else {
            data.unitMeasurement += '/annum'
          }
        }
        const specificationEfficiencyClass = specifications.find((item) => {
          return item.match(new RegExp('Clasa energetica potrivit noilor etichete energetice adoptate la nivelul UE'))
        })
          ? specifications.find((item) => {
              return item.match(
                new RegExp('Clasa energetica potrivit noilor etichete energetice adoptate la nivelul UE')
              )
            })
          : specifications.find((item) => {
              return item.match(new RegExp('Clasa energetica'))
            })
        data.efficiencyClass = specificationEfficiencyClass
          ? specificationEfficiencyClass.split(' ').pop().replace('.', '')
          : ''
      }
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