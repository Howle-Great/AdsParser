import cheerio from 'cheerio'
import md5 from 'md5'
import pngToJpeg from 'png-to-jpeg'

import BasePage from './basePage'

export default class adsDescPage extends BasePage {
  constructor(page, browser) {
    super(page, browser)
    this.ADS_BLOCK = '.snippet-horizontal'
    this.ADS_BLOCK_URL = '.snippet-link'
    this.ADS_BLOCK_NUM = (num) => `.snippet-horizontal:nth-of-type(${num}) a.snippet-link`
    this.PAGE_NUMBER = 'div[data-marker="pagination-button"] span:nth-last-child(2)'
    this.SINGIN_BLOCK = '[data-marker="auth-app"]'
    this.SINGIN_BLOCK_CLOSE = '[data-marker="auth-app"] [title="Закрыть"]'

    this.PAGEDATA_TITLE = '.title-info-title-text'
    this.PAGEDATA_TIME = '.title-info-metadata-item-redesign'
    this.PAGEDATA_SHOWTELEPHONE_BLOCK = 'a[data-marker="item-phone-button/card"]'
    this.PAGEDATA_SHOWTELEPHONE_IMAGE = '[data-marker="item-phone-button/card"] img'
    this.PAGEDATA_TELEPHONEBLOCK_CLOSE = '.b-popup.item-popup .close'
    this.PAGEDATA_TELEPHONEBLOCK_IMAGE = '.b-popup.item-popup img'
    this.PAGEDATA_COST = '.js-item-price[itemprop="price"]:nth-child(2)'
    this.PAGEDATA_PLELDGE = '.item-price-sub-price div:first-child'
    this.PAGEDATA_COMMISSION = '.item-price-sub-price div:last-child'
    this.PAGEDATA_USER_URL = '.item-view-seller-info a.seller-info-avatar-image'

    this.browser.setMaxListeners(1)
  }

  async getPagesNumber(page = this.page) {
    try {
      const content = await this.getContent(page)
      const $ = cheerio.load(content)

      console.log(`\n\t getPagesNumber: ${parseInt($(this.PAGE_NUMBER).text())}`)

      return parseInt($(this.PAGE_NUMBER).text())
    } catch (error) {
      throw new Error(`Can't get pages number. An error happened: \n${error}`)
    }
  }

  async clickOnAd(num) {
    num += 1
    console.log(`clickOnAd: ${num}`);
    await this.click(this.ADS_BLOCK_NUM(num))

    const newPagePromise = async () => {
      return new Promise(x => {
          this.browser.on('targetcreated', async target => {
              if (target.type() === 'page') {
                  const newPage = await target.page();
                  const newPagePromise = new Promise(y =>
                      newPage.once('domcontentloaded', () => y(newPage))
                  );
                  const isPageLoaded = await newPage.evaluate(
                      () => document.readyState
                  );
                  return isPageLoaded.match('complete|interactive')
                      ? x(newPage)
                      : x(newPagePromise);
              }
          })
      })}
    const newPage = await newPagePromise();
    this.browser.removeAllListeners('targetcreated');
    await newPage.bringToFront();
    return newPage;
  }

  async parseData() {
    try {
      const content = await this.getContent(this.newPage)
      const $ = cheerio.load(content)

      await this.click(this.PAGEDATA_SHOWTELEPHONE_BLOCK, this.newPage)
      console.log(`parseData PAGEDATA_SHOWTELEPHONE_BLOCK`)
      // await this.newPage.waitFor(10000);
      const signInWindowIsNotHidden = await this.isNotHidden(this.SINGIN_BLOCK, this.newPage);
      if (signInWindowIsNotHidden) {
        await this.newPage.keyboard.press('Escape')
        await this.click(this.PAGEDATA_SHOWTELEPHONE_BLOCK, this.newPage)

      //   await this.click(this.SINGIN_BLOCK_CLOSE, this.newPage)
      }

      await this.click(this.PAGEDATA_TELEPHONEBLOCK_CLOSE, this.newPage)
      console.log(`parseData PAGEDATA_TELEPHONEBLOCK_CLOSE`)

      await this.newPage.waitForSelector(this.PAGEDATA_SHOWTELEPHONE_IMAGE)
      let phone = await this.newPage.evaluate((selector) => 
        document.querySelectorAll(selector)[0].getAttribute('src'),
        this.PAGEDATA_SHOWTELEPHONE_IMAGE
      )

      phone = await this.imageRecognition(phone)
      console.log(`Phone recognized! ${phone}`);
      
      let data = {
        url: this.page.url(),
        title: $(this.PAGEDATA_TITLE).text(),
        time: $(this.PAGEDATA_TIME).text(),
        phone: phone,
        cost: $(this.PAGEDATA_COST).text(),
        commission: $(this.PAGEDATA_COMMISSION).text(),
      }

      console.log(`parseData - data is: ${[data.url, data.title, data.time, data.phone, data.cost, data.commission]}`)
      
      return [
        data,
        phone
      ]
    } catch (error) {
      throw new Error(`Can't parse data. An error happened: \n${error}`)
    }
  }

  async getAd(num) {
    try {
      console.log("getAd");
      
      this.newPage = await this.clickOnAd(num)
      const [data, phone] = await this.parseData()
      this.newPage.close()
      delete this.newPage
      return [data, phone] ;
    } catch (error) {
      throw new Error(`Can't get ad from page. An error happened: \n${error}`)
    }
  }

  async getAllAds() {
    try {
      console.log(`getAllAds begin \n`);
      
      const content = await this.getContent()
      const $ = cheerio.load(content)
      const arrayData = []
      const arrayRealtors = []

      for (const [iElem, elem] of $(this.ADS_BLOCK).toArray().entries()) {
        console.log(`getContent for ${iElem}`);
        
        if ($(this.ADS_BLOCK_NUM(iElem + 2)).toArray()[0] == undefined) {
          continue
        }

        if (iElem >= 5) {
          continue
        }
        const [data, phone]  = await this.getAd(iElem + 1)
        arrayData.push(data)
        arrayRealtors.push(phone)
      }
      return [arrayData, arrayRealtors]
    } catch (error) {
      throw new Error(`Can't get all ads from page. An error happened: \n${error}`)
    }
  }


}