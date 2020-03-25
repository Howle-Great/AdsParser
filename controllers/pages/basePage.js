import chalk from 'chalk'
import fs from 'fs-extra'

import generateRandomName from '../../helpers/randomName'


// import ocr from 'ocr'

export default class BasePage {
  constructor(page, browser) {
    this.page = page
    this.browser = browser
  }

  async getContent(page = this.page) {
    try {
      console.log(`adsDescPage getContent. Page: ${page}`);
      return await page.content()
    } catch (error) {
      throw new Error(`Can't get content. An error happened: \n${error}`)
    }
  }

  async click(selector, page = this.page) {
    try {
      await page.waitForSelector(selector, {visible: true})
      await page.click(selector)
    } catch (error) {
      throw new Error(`An error an occurred. 'click' function in BasePage fell with: \n${error}`)
    }
  }

  async isNotHidden(selector, page = this.page) {
    try {
      if (selector) {
          return await page.evaluate((elem) => {
            const element = document.querySelectorAll(elem)[0]
            if (element) {
            } else {
              return false
            }
            const styles = window.getComputedStyle(element)
            return styles && styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0'
          }, selector)
      } else {
        throw new Error(`An error an occurred. 'isNotHidden' function in BasePage fell because selector == undefined`)
      }
    } catch (error) {
      throw new Error(`An error an occurred. 'isNotHidden' function in BasePage fell with: \n${error}`)
    }
  }


}