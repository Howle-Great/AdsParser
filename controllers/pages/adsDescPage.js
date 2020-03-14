import cheerio from 'cheerio'

import md5 from 'md5'

export default class adsDescPage {
  constructor(page) {
    this.page = page

    this.ADS_BLOCK = '.snippet-horizontal'
    this.ADS_BLOCK_URL = '.snippet-link'
    this.PAGE_NUMBER = 'div[data-marker="pagination-button"] span:nth-last-child(2)'
  
    this.PAGEDATA_TITLE = '.title-info-title-text'
    this.PAGEDATA_TIME = '.title-info-metadata-item-redesign'
    this.PAGEDATA_SHOWTELEPHONE_BLOCK = '[data-marker="item-phone-button/card"]'
    this.PAGEDATA_SHOWTELEPHONE_IMAGE = '[data-marker="item-phone-button/card"] img'
    this.PAGEDATA_TELEPHONEBLOCK_CLOSE = '.b-popup.item-popup .close'
    this.PAGEDATA_TELEPHONEBLOCK_IMAGE = '.b-popup.item-popup img'
    this.PAGEDATA_COST = '.js-item-price[itemprop="price"]:nth-child(2)'
    this.PAGEDATA_PLELDGE = '.item-price-sub-price div:first-child'
    this.PAGEDATA_COMMISSION = '.item-price-sub-price div:last-child'
    this.PAGEDATA_USER_URL = '.item-view-seller-info a.seller-info-avatar-image'
  }


  ADS_BLOCK_NUM(num) {
    return `.snippet-horizontal:nth-of-type(${num})`
  }

  async getContent() {
    try {
      console.log(`adsDescPage getContent. Page: ${this.page}`);
      let content = await this.page.content()
      return content
    } catch (error) {
      return error;
    }
  }

  async getPagesNumber() {
    try {
      content = await this.getContent()
      console.log(`getPagesNumber content: ${content}`);
      
      const $ = cheerio.load(content)
      console.log(`\n\t getPagesNumber: ${parseInt($(this.PAGE_NUMBER).text())}`);
      return parseInt($(this.PAGE_NUMBER).text())
    } catch (error) {
      return error
    }
  }

  clickOnAd(num) {
    console.log(`clickOnAd: ${num}`);
    num += 1
    this.page.click(ADS_BLOCK_NUM(num))
  }

  async parseData() {
    try {
      content = await this.getContent()
      const $ = cheerio.load(pageContent)
      this.page.click(this.PAGEDATA_SHOWTELEPHONE_BLOCK)
      this.page.click(this.PAGEDATA_TELEPHONEBLOCK_CLOSE)
      phone = $(this.PAGEDATA_SHOWTELEPHONE_IMAGE).attr('href')

      phoneHash = md5(phone)

      let data = {
        url: this.page.url(),
        title: $(this.PAGEDATA_TITLE),
        time: $(this.PAGEDATA_TIME),
        phone: phone,
        cost: $(this.PAGEDATA_COST),
        commission: $(this.PAGEDATA_COMMISSION),
      }

      return {
        data,
        phoneHash
      }
    } catch (error) {
      return error
    }
  }

  async getAd(num) {
    try {
      console.log("getAd");
      
      clickOnAd(num)
      const data = await parseData()
      this.page.close()
      return data;
    } catch (error) {
      return error
    }
  }

  async getAllAds() {
    try {
      console.log(`getAllAds begin \n`);
      
      content = await this.getContent()
      console.log(`getAllAds after getContent. content - ${content}`);
      
      const $ = cheerio.load(pageContent)
      arrayData = []
      arrayRealtors = []
      console.log(`$(this.ADS_BLOCK): ${$(this.ADS_BLOCK)}`)
      for (const iterator of $(this.ADS_BLOCK)) {
        console.log(`getContent in Loop`);
        
        data = await getAd(iElem + 1)
        arrayData.push(data)
        arrayRealtors.push(phoneHash)
      }
      return {arrayData, arrayRealtors}
    } catch (error) {
      return error
    }
  }


}