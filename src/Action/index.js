import axios from 'axios'

const apiKey = 'd7a3899e98bd2b99c0688f59a49d5812'
const mapsApiKey = 'AIzaSyADOd7bWq-wl-2wJ-r3a4uGUtGK2xLcdqY'

export const getAirQualityIndex = async (lat, lon) => {
  console.log(lat, lon)
  return new Promise((next) => {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    axios
      .get(url)
      .then(async x => {
        return next({ success: true, error: false, data: x.data })
      })
      .catch(err => {
        console.log(err)
        return next({ success: false, error: true, data: err })
      })
  })
}
export const getLocationData = async (lat, lon) => {
  console.log(lat, lon)
  return new Promise((next, reject) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lon}&key=${mapsApiKey}`
    axios
      .get(url)
      .then(async x => {
        return next({ success: true, error: false, data: x.data })
      })
      .catch(err => {
        console.log(err)
        return next({ success: false, error: true, data: err })
      })
  })
}
