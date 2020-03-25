import { createWorker } from 'tesseract.js'
import fs from 'fs-extra'
import base64Img from 'base64-img'

import generateRandomName from './randomName'

// export class ImageRecognition {
//   constructor(imgPath) {
//     this.imgPath = imgPath
//   }

//   async start() {
//     try {
//       this.worker = createWorker();
//       await this.worker.load();
//       await this.worker.loadLanguage('eng');
//       await this.worker.initialize('eng');
//       await this.worker.setParameters({
//         tessedit_char_whitelist: '0123456789',
//       });
//     } catch (error) {
//       throw error
//     }
//   }

//   async saveImg(imgBuf) {
//     try {
//       const filename = generateRandomName()
//       base64Img.img(imgBuf, this.imgPath, filename, (err, filePath) => {})

//       console.log(`Created PNG!`);

//       return filename
//     } catch (error) {
//       throw error
//     }
//   }

//   async deleteImg(filePath) {
//     try {
//       await fs.unlink(filePath)
//     } catch (error) {
//       throw error
//     }
//   }

//   async recognition(imgBuf) {
//     try {
//       // await this.start()
//       const filename = await this.saveImg(imgBuf)
//       const filePath = `${this.imgPath}/${filename}.png`
//       console.log(`this.worker.recognize: ${filePath}`);
//       const { data: { text } } = await this.worker.recognize(filePath);
//       console.log(`filePath`);
//       this.deleteImg(filePath)

//       console.log(text);
//       // await this.destroy()
//       return text
//     } catch (error) {
//       throw error
//     }
//   }

//   async destroy() {
//     try {
//       await this.worker.terminate();
//     } catch (error) {
//       throw error
//     }
//   }
// }

export default async function imageRecognition(imgPath, phone) {
  try {
    let worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789',
    });
    const filename = generateRandomName()
    
    base64Img.img(phone, imgPath, filename, (err, filePath) => {})

    console.log(`Created PNG!`);
    const filePath = `${imgPath}/${filename}.png`
    console.log(`this.worker.recognize: ${filePath}`)
    const { data: { text } } = await worker.recognize(filePath)
    console.log(`filePath`)
    await fs.unlink(filePath)
    console.log(text)
    await worker.terminate()
    

    return text
  } catch (error) {
    throw error
  }
}