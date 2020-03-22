import chalk from 'chalk'
import tesseract_wrapper from 'tesseract-wrapper'
import QuickSaver from '../../helpers/saverFiles'
import { createWorker } from 'tesseract.js'
import base64Img from 'base64-img'
import fs from 'fs-extra'

// import ocr from 'ocr'

export default class BasePage {
  constructor(page, browser) {
    this.page = page
    this.browser = browser
    this.path = '/temp'
    this.saver = new QuickSaver(this.path)
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


  async imageRecognition(imgBuf) {
    // const base64Data = Buffer.from(imgBuf, 'base64'); 
    const destpath = `${__dirname}/../..${this.path}/`
    const filename = this.saver._generateRandomName()
    base64Img.img(imgBuf, destpath, filename, (err, filepath) => {})
    console.log(`Created PNG!`);
    
    let worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789',
    });
    const filePath = `${__dirname}/../..${this.path}/${filename}.png`
    const { data: { text } } = await worker.recognize(filePath);
    await fs.unlink(filePath)
    console.log(text);
    await worker.terminate();
    return text
  }
}