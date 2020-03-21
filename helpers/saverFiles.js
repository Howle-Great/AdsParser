import fs from 'fs-extra'

export default class QuickSaver {
  constructor(tmpPath) {
    this.tmpPath = tmpPath
    this.tmpName = ''
    this.prefix = ''
  }

  changeTmpPath(tmpPath) {
    this.tmpPath = tmpPath
  }

  filePath() {
    return `${__dirname}/..${this.tmpPath}/${this.tmpName}.${this.prefix}`
  }

  fileName() {
    return `${this.tmpName}.${this.prefix}`
  }

  async save(data, prefix, options) {
    try {
      this.prefix = prefix
      this.tmpName = this._generateRandomName()
      console.log(`filePath is: ${this.filePath()}`);
      console.log(`fileName is: ${this.fileName()}`);
      await fs.outputFile(this.filePath(), data, options)
    } catch (error) {
      throw new Error(`An error happened in QuickSaver: \n${error}`)
    }
  }

  async open() {
    try {
      await fs.readFile(this.filePath())
    } catch (error) {
      throw new Error(`An error happened in QuickSaver: \n${error}`)
    }
  }

  async delete() {
    try {
      await fs.remove(this.filePath(), data)
    } catch (error) {
      throw new Error(`An error happened in QuickSaver: \n${error}`)
    }
  }

  _generateRandomName() {
    return String(Date.now()) + String(Math.floor(Math.random() * 65536));
  }
}