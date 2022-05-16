import axios from 'axios'

const API_KEY = '9dbb22786edf5ee63f9373807567d257'

const instance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/',
  });


export default {
    async getCities() {
      let response = await axios.get('/src/libraries/city.list.json');
      return response.data
    }
}