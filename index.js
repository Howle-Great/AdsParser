import cheerio from 'cheerio'
import chalk from 'chalk'

import {getPageContent} from './helpers/puppeteer'
import AsdDesc from './controllers/adsDescController'


import adsDescPage from './controllers/pages/adsDescPage'
import writeToJSON from './handlers/handlers'

const SITE = 'https://www.avito.ru/moskva/kvartiry/sdam-ASgBAgICAUSSA8gQ?f=ASgBAQICAUSSA8gQAUDMCESSWZBZjlmMWQ'
let pages = 1;

(async function main() {
  try {
    let desc = new AsdDesc(SITE)
    await desc.launch()
    let [arrayData, arrayRealtors] = await desc.parse()
    writeToJSON(arrayData, 'ads.json')
    // writeToJSON(arrayData, 'realtors.json')

    console.log(`arrayData: ${arrayData}`)
    console.log(`arrayRealtors: ${arrayRealtors}`)
    desc.destroy()

    // let data = [{
    //   info: 'sad',
    //   phone: '879223'
    // },
    // {
    //   info: 'wddsad',
    //   phone: '534534534'
    // }]
    
    // writeToJSON(data, 'ads.json')

  } catch (error) {
    console.log(chalk.red(`An error has occurred \n`))
    console.log(error)
  }

})()

