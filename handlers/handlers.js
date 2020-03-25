import fs from 'fs-extra'
import imageRecognition from '../helpers/imageRecognition'
import dataConverter from '../helpers/dataConverter'



export function writeToJSON(data, filename) {
  const path = `${__dirname}/../data`
  let json = JSON.stringify(data)
  fs.writeFile(`${path}/${filename}`, json, 'utf8', (err) =>{})
}

export async function writeRealtors(parseData) {
  try {
    const imgPath = `${__dirname}/../temp`
    // const imgRecognition = new ImageRecognition(imgPath)
    // await imgRecognition.start()
  
    let realtorsList = []

    for (let elem of parseData) {
      try {
        elem.data = dataConverter(elem.data)
        console.log(`imageRecognition: ${imageRecognition}, realtorsList: ${realtorsList},\n\n elem.data: ${elem.phone}`);
        
        elem.phone = await imageRecognition(imgPath, elem.phone)
        realtorsList.push(elem.phone)
      } catch (error) {
        throw error
      }
    }
  
    writeToJSON(parseData, 'realtorsAds.json')
    writeToJSON(realtorsList, 'realtorsList.json')
  
    // await imgRecognition.destroy()
  } catch (error) {
    throw error
  }
}