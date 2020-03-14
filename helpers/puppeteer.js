import puppeteer from 'puppeteer'
import {LAUNCH_PUPPETEER_OPTS, PAGE_PUPPETEER_OPTS} from './puppeteerConfig'

export async function getPageContent(url) {
  try {
    const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS)
    const page = await browser.newPage()
    await page.goto(url, PAGE_PUPPETEER_OPTS)
    const content = await page.content()
    browser.close()

    return content;
  } catch (error) {
    return error;
  }
};

// export class PuppeteerHandler {
//   constructor() {
//     this.browser = null;
//   }
//   async initBrowser() {
//     this.browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
//   }
//   closeBrowser() {
//     this.browser.close();
//   }
//   async getPageContent(url) {
//     if (!this.browser) {
//       await this.initBrowser();
//     }

//     try {
//       const page = await this.browser.newPage();
//       await page.goto(url, PAGE_PUPPETEER_OPTS);
//       const content = await page.content();
//       return content;
//     } catch (err) {
//       throw err;
//     }
//   }
// }
