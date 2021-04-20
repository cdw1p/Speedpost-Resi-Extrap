const axios = require('axios')
const fs = require('fs-extra')
require('colors')

const randomNumber = (length) => new Promise((resolve, reject) => {
  const result = []
  const characters = '0123456789'
  for (var i = 0; i < length; i++) result.push(characters.charAt(Math.floor(Math.random() *  characters.length)))
  resolve(result.join(''))
})

const getResiTracking = (number) => new Promise(async (resolve, reject) => {
  const postData = { data: [{ num: number, fc: '19131', sc: 0 }], guid: '', timeZoneOffset: -420 }
  const getResponse = await axios.post(`https://t.17track.net/restapi/track`, postData, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:87.0) Gecko/20100101 Firefox/87.0',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Origin': 'https://m.17track.net',
      'Referer': 'https://m.17track.net/',
      'Cookie': '__cfduid=d026b2ca1a7b9f3600f85801771b883b31617871830; _yq_bid=G-E68A9591B40FBEC4; _ga=GA1.2.1821047712.1617871832; __gads=ID=4c2b4406beed40d0-2285921817c70060:T=1617871834:S=ALNI_MZ6zETmzdzKnKG4iqDTrJX-x4rX4w; cto_bundle=G71OG193UUhiN3ZPMiUyQm5vTHY0dVIwYkgxSndOZ0prZzk4eENERldOdlBwR2tJMU1EZE9yYiUyQk5LNWVaaTBJdzdSdDRzVDU1QzFSV3o4V2twWWxDTkFkeWNwQXBad1lQWUxmTVV3RHR2WmFGZGxwY3B5cHZLN1c0RGxzR0p6NE1PenZJNTk4WkhQdUs0OHFtcnNvN3ZzN09KbVphbDVJcm1wQmhleWtiek1IZmJjOXAwJTNE; v5_TranslateLang=en; _gid=GA1.2.456493433.1618939346; _gat=1; FCCDCF=[["AKsRol8c6PbFkYpXRu2Omr9f4dhIJL0HBY6S_N0w-ehCSvsZvmlRto_lKTMaw-wM1bRcKYgB3A35uhs3U8dgH_SEaTBiBj1j_W_J4CxwA25bz3syuF8WCTVnZuX_ja1BlVCsa_oYUnrxwOZNGV_wJuGn0BpVzV1Kmg=="],null,["[[],[],[],[],null,null,true]",1618939344964],null,null]; Last-Event-ID=657572742f6365322f35646534653430663837312f2d71791a22189f3c5b4f19e069',
      'Cache-Control': 'max-age=0'
    }
  })
  if (getResponse.data.dat[0].track && getResponse.data.dat[0].track.z0.z) {
    const statusParcel = { date: getResponse.data.dat[0].track.z0.a, message: getResponse.data.dat[0].track.z0.z }
    resolve({ valid: true, resi: number, status: `${statusParcel.message} (${statusParcel.date})` })
  } else {
    resolve({ valid: false, resi: number })
  }
})

;(async () => {
  try {
    while (true) {
      const prefixResi = ['SHSG1', 'SHSG2', 'SHSG3', 'SHSG4', 'SHSG5', 'SHSG6', 'SHSG7', 'SHSG8', 'SHSG9', 'SHSG0']
      const formatResi = `${prefixResi[Math.floor(Math.random() * prefixResi.length)]}${await randomNumber(10)}`
      const resTracking = await getResiTracking(formatResi)
      if (resTracking.valid) {
        const normalizeOutput = `${resTracking.resi} - ${resTracking.status}`
        await fs.ensureDirSync('output')
        await fs.appendFileSync('./output/sg_list.txt', `${normalizeOutput}\n`)
        console.log(normalizeOutput.green.bold)
      } else {
        const normalizeOutput = `${resTracking.resi} - INVALID`
        console.log(normalizeOutput.red)
      }
    }
  } catch (err) {
    console.log(`Error: ${err.message}`.red)
  }
})()