export default function dataConverter(data) {
  const timeRegex = /\d\d:\d\d:\d\d/
  const monthRegex = /\s\D+\sв/
  const dayRegex = /\d+\s/

  const monthDateRegex = /\D{3}\s\d{1,2}/
  let currentData = new Date()

  console.log(`data is: ${data}`);
  
  if (data.includes('сегодня в ')) {
    const time = data.replace('сегодня в ', '')
    console.log(`0: ${currentData.toUTCString()}`);
    currentData.setMinutes(parseInt(time.split(':')[1]))
    console.log(`1: ${currentData.toUTCString()}`);
    
    currentData.setHours(parseInt(time.split(':')[0]))
    console.log(`2: ${currentData.toUTCString()}, parse: ${parseInt(time.split(':')[0])}`);
  } else if (data.includes('вчера в ')) {
    const time = data.replace('вчера в ', '')
    currentData.setMinutes(parseInt(time.split(':')[1]))
    currentData.setHours(parseInt(time.split(':')[0]))
    currentData.setDate(currentData.getDate() - 1)
  } else {
    const month = data.match(monthRegex)[0].match(/\D{2,}/)
    let dateDict = {
      'января': 'Jan',
      'февраля': 'Feb',
      'марта': 'Mar',
      'апреля': 'Apr',
      'мая': 'May',
      'июня': 'Jun',
      'июля': 'Jul',
      'августа': 'Aug',
      'сентября': 'Sep',
      'октября': 'Oct',
      'ноября': 'Nov',
      'декабря': 'Dec',
    }
    const monthInDateForm = dateDict[month]
    let dateArray = Array.from( Object.values(dateDict) )
    const difference = dateArray.findIndex(elem => monthInDateForm === elem) - dateArray.findIndex((elem) => currentData.getMonth() === elem)
    // Don't watch on year
    if (difference === 11) {
      currentData.setMonth(currentData.getMonth() + 11)
      currentData.setYear(currentData.getYear() - 1)
    } else {
      currentData.setMonth(currentData.getMonth() - difference)
    }
    console.log(`currentDate: ${currentData}, currentData.getDate(): ${currentData.getDate()}, -: ${(currentData.getDate() - parseInt(data))}`)
    currentData.setDate(currentData.getDate() - (currentData.getDate() - parseInt(data)))
  }
  return currentData.toUTCString()
}