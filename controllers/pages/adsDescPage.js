import cheerio from 'cheerio'

import md5 from 'md5'

export default class adsDescPage {
  constructor(page, browser) {
    this.page = page
    this.browser = browser

    this.ADS_BLOCK = '.snippet-horizontal'
    this.ADS_BLOCK_URL = '.snippet-link'
    this.PAGE_NUMBER = 'div[data-marker="pagination-button"] span:nth-last-child(2)'
  
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
  }


  ADS_BLOCK_NUM(num) {
    return `.snippet-horizontal:nth-of-type(${num}) a.snippet-link`
  }

  async getContent(page) {
    try {
      console.log(`adsDescPage getContent. Page: ${page}`);
      let content = await page.content()
      // console.log(`adsDescPage getContent. content: ${content}`);

      return content
    } catch (error) {
      throw new Error(`Can't get content. An error happened: \n${error}`)
    }
  }

  async getPagesNumber(page = this.page) {
    try {
      let content = await this.getContent(page)
      // console.log(`getPagesNumber content: ${content}`);
      
      const $ = cheerio.load(content)
      console.log(`\n\t getPagesNumber: ${parseInt($(this.PAGE_NUMBER).text())}`);
      return parseInt($(this.PAGE_NUMBER).text())
    } catch (error) {
      throw new Error(`Can't get pages number. An error happened: \n${error}`)
    }
  }

  async clickOnAd(num) {
    num += 1
    console.log(`clickOnAd: ${num}`);
    await this.page.click(this.ADS_BLOCK_NUM(num), {waitUntil: 'load'})
    const newPagePromise = new Promise(x => this.browser.on('targetcreated', target => x(target.page())));
    const newPage = await newPagePromise;
    await newPage.bringToFront()
    this.newPage = newPage
    
  }

  async parseData() {
    try {
      let content = await this.getContent(this.newPage)
      const $ = cheerio.load(content)
      await this.newPage.waitForNavigation();
      // await this.page.waitFor(5000)

      // let browsers = await this.browser.pages()
      // browsers.forEach(element => {
      //   console.log(`parseData load. URL: ${element.url()}`)
      // });
      console.log(`newPage url is: ${this.newPage.url()}`)
      
      
      // await this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 100002 }),
      // await this.newPage.waitFor(10000)
      // await this.page.waitForFunction(this.PAGEDATA_SHOWTELEPHONE_BLOCK)
      await this.newPage.click(this.PAGEDATA_SHOWTELEPHONE_BLOCK, {waitUntil: 'load'})
      console.log(`parseData PAGEDATA_SHOWTELEPHONE_BLOCK`);
      await this.newPage.waitForSelector(this.PAGEDATA_TELEPHONEBLOCK_CLOSE, {optons: 'visible'})
      await this.newPage.click(this.PAGEDATA_TELEPHONEBLOCK_CLOSE, {waitUntil: 'load'})
      console.log(`parseData PAGEDATA_TELEPHONEBLOCK_CLOSE`);
      // await this.page.click(this.PAGEDATA_SHOWTELEPHONE_BLOCK)
      // console.log(`parseData PAGEDATA_SHOWTELEPHONE_BLOCK`);
      // await this.page.click(this.PAGEDATA_TELEPHONEBLOCK_CLOSE)
      // console.log(`parseData PAGEDATA_TELEPHONEBLOCK_CLOSE`);
      // this.page.click(this.PAGEDATA_SHOWTELEPHONE_BLOCK)
      // this.page.click(this.PAGEDATA_TELEPHONEBLOCK_CLOSE)

      await this.newPage.waitForSelector(this.PAGEDATA_SHOWTELEPHONE_IMAGE)
      let phone = await this.newPage.evaluate((selector) => {
        console.log(`selector is:  ${selector}`);
        
        return document.querySelectorAll(selector)[0].getAttribute('src')
      }, this.PAGEDATA_SHOWTELEPHONE_IMAGE)

      console.log(`parsed Phone number as: ${phone}`);
      let phoneHash = md5(phone)
      console.log(`cashed Phone number as: ${phoneHash}`);

      
      let data = {
        url: this.page.url(),
        title: $(this.PAGEDATA_TITLE),
        time: $(this.PAGEDATA_TIME),
        phone: phone,
        cost: $(this.PAGEDATA_COST),
        commission: $(this.PAGEDATA_COMMISSION),
      }
      console.log(`parseData - data is: ${data}`)
      
      return {
        data,
        phoneHash
      }
    } catch (error) {
      throw new Error(`Can't parse data. An error happened: \n${error}`)
    }
  }

  async getAd(num) {
    try {
      console.log("getAd");
      
      await this.clickOnAd(num)
      const data = await this.parseData()
      this.newPage.close()
      return data;
    } catch (error) {
      throw new Error(`Can't get ad from page. An error happened: \n${error}`)
    }
  }

  async getAllAds() {
    try {
      console.log(`getAllAds begin \n`);
      
      let content = await this.getContent(this.page)
      // console.log(`getAllAds after getContent. content - ${content}`);
      
      const $ = cheerio.load(content)
      let arrayData = []
      let arrayRealtors = []
      // console.log(`$(this.ADS_BLOCK): ${$(this.ADS_BLOCK)}`)
      for (const [iElem, elem] of $(this.ADS_BLOCK).toArray().entries()) {
        console.log(`getContent in Loop`);
        
        let data = await this.getAd(iElem + 1)
        arrayData.push(data.data)
        arrayRealtors.push(data.phoneHash)
      }
      return {arrayData, arrayRealtors}
    } catch (error) {
      throw new Error(`Can't get all ads from page. An error happened: \n${error}`)
    }
  }


}