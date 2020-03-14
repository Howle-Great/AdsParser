import cheerio from 'cheerio'
import chalk from 'chalk'

import {getPageContent} from './helpers/puppeteer'

import selectors from './helpers/selectors'

const SITE = 'https://www.avito.ru/moskva/kvartiry/sdam-ASgBAgICAUSSA8gQ?f=ASgBAQICAUSSA8gQAUDMCESSWZBZjlmMWQ&p='
const pages = 1;

(async function main() {
  try {
    for (let page = 1; page < pages + 1; page++) {
      const url = `${SITE}${page}`;
      const pageContent = await getPageContent(url)
      const $ = cheerio.load(pageContent)
      const adsList = []

      $(selectors.adsBlock).each((i, header) => {
        const url = $(header).find($(selectors.adsBlockLink)).attr('href')
        const title = $(header).find($(selectors.adsBlockLink)).attr('title')
        adsList.push({url, title})
      })

      console.log(adsList);
      
    }
    
  } catch (error) {
    console.log(chalk.red(`An error has occurred \n`))
    console.log(error)
    
  }

})()

