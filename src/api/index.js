import axios from 'axios'

const API_KEY = '9dbb22786edf5ee63f9373807567d257'

const instance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/',
  });


export default {
    requestCityInfoByID(id) {
      return instance.get(`weather?id=${id}&appid=${API_KEY}`)
    },
    requestCityInfoByName(name) {
      return instance.get(`weather?q=${name}&appid=${API_KEY}`)
        .catch(({message}) => {
          alert(`Request weather in ${name} is failed, please check correct name`)
        })
    }
}