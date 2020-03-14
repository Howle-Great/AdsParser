import puppeteer from 'puppeteer'

// import BaseClass from './basePuppeteer'
import adsDescPage from './pages/adsDescPage'
import {LAUNCH_PUPPETEER_OPTS, PAGE_PUPPETEER_OPTS} from '../helpers/puppeteerConfig'


export default class AsdDesc{
  constructor(url) {
    this.url = url
  }

  goToPage(url, num) {
    return `${url}&p=${num}`
  }

  async launch() {
    try {
      console.log("AsdDesc launch " + this.url)
      const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS)
      const page = await browser.newPage()
      await page.goto(this.url, PAGE_PUPPETEER_OPTS)
      console.log("AsdDesc launch adsDescPage")
      this.adsDesc_page = new adsDescPage(page)
      this.page = page
      this.browser = browser
    } catch (error) {
      return error;
    }
  }

  destroy() {
    this.browser.close()
  }

  async getContent() {
    try {
      const content = await this.page.content()
      return content;
    } catch (error) {
      return error;
    }
  }

  async parse() {
    try {
      console.log("parse");
      
      const pageNumber = await this.adsDesc_page.getPagesNumber()
      let {arrayData, arrayRealtors} = await this.adsDesc_page.getAllAds()
      console.log(`parse: arrayData - ${arrayData}, arrayRealtors - ${arrayRealtors}`);
      
      for (let index = 2; index < pageNumber; index++) {
        await this.page.goto(this.goToPage(this.url, index))
        const {newArrayData, newArrayRealtors} = await this.adsDesc_page.getAllAds()
        arrayData.concat(newArrayData)
        arrayRealtors.concat(newArrayRealtors)
      }
      return {arrayData, arrayRealtors}
    } catch (error) {
      console.error("Error!!! ");
      
      return error
    }
  }
  
}