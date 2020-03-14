// import puppeteer from 'puppeteer'
// import cheerio from 'cheerio'

// import {LAUNCH_PUPPETEER_OPTS, PAGE_PUPPETEER_OPTS} from '../helpers/puppeteerConfig'


// export class BaseClass {
//   goToPage = (url, num) => `${url}&p=${num}`

//   async launch(url) {
//     try {
//       this.url = url
//       this.browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS)
//       this.page = await browser.newPage()
//       await page.goto(url, PAGE_PUPPETEER_OPTS)
//     } catch (error) {
//       return error;
//     }
//   }

//   async getContent() {
//     try {
//       const content = await page.content()
//       return content;
//     } catch (error) {
//       return error;
//     }
//   }
  
// }