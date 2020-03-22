import fs from 'fs-extra'

export default function writeToJSON(data, filename) {
  const path = `${__dirname}/../data`
  let json = JSON.stringify(data)
  fs.writeFile(`${path}/${filename}`, json, 'utf8', (err) =>{})
}