import api from '../api'
export const fetchByID = (city) => {
    return api.requestCityInfoByID(city.id)
        .catch(({message}) => {
          alert(`Request weather in ${city.name} is failed`)
        })
}