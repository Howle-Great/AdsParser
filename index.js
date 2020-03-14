import cheerio from 'cheerio'
import chalk from 'chalk'

import {getPageContent} from './helpers/puppeteer'
import AsdDesc from './controllers/adsDescController'


const SITE = 'https://www.avito.ru/moskva/kvartiry/sdam-ASgBAgICAUSSA8gQ?f=ASgBAQICAUSSA8gQAUDMCESSWZBZjlmMWQ'
let pages = 100;

(async function main() {
  try {
    let desc = new AsdDesc(SITE)
    await desc.launch()
    let {arrayData, arrayRealtors} = await desc.parse()
    console.log(`arrayData: ${arrayData}`)
    console.log(`arrayRealtors: ${arrayRealtors}`)
    desc.destroy()
    
  } catch (error) {
    console.log(chalk.red(`An error has occurred \n`))
    console.log(error)
    
  }

})()

