import cheerio from 'cheerio'
import chalk from 'chalk'

import {getPageContent} from './helpers/puppeteer'
import AsdDesc from './controllers/adsDescController'


import adsDescPage from './controllers/pages/adsDescPage'
import {writeToJSON, writeRealtors} from './handlers/handlers'
import dataConverter from './helpers/dataConverter'

const SITE = 'https://www.avito.ru/moskva/kvartiry/sdam-ASgBAgICAUSSA8gQ?f=ASgBAQICAUSSA8gQAUDMCESSWZBZjlmMWQ'
let pages = 1;

(async function main() {
  try {
    const desc = new AsdDesc(SITE)
    await desc.launch()
    const parseData = await desc.parse()
    writeRealtors(parseData)

    desc.destroy()
  
    // console.log('OutDate: ' + dataConverter('сегодня в 01:02'));
     

  } catch (error) {
    console.log(chalk.red(`An error has occurred \n`))
    console.log(error)
  }

})()

