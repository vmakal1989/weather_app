<template>
    <main class="container">
      <div class="search">
        <input 
          type="text" 
          placeholder="Enter city name" 
          v-model.trim="searchCity"
        />
        <button class="search__btn" :disabled="!searchCity" @click="getCityInfoByName">search</button>
      </div>
      <div class="weather" v-if="citiesWeatherInfo.length">
        <ul class="weather__city-list">
          <li v-for="city of citiesWeatherInfo" :key="city.id">
            <span class="weather__city-name">{{`${city.name}, ${city.sys.country}`}}</span>
            <span class="weather__city-info" v-html="Math.round(city.main.temp - 273) + '&deg'"/>
            <span class="weather__city-remove" v-html="'&#10060;'" @click="removeCity(city.id)"/> 
          </li>
        </ul>
        <button class="weather__update" v-html="'update'" @click="updateCitiesInfo()" :disabled="disabledUpdate"/>
      </div>
    </main>
</template>

<script>
import {ref, computed} from 'vue'
import api from './api'
import { fetchByID } from './use/fetch'
import _ from 'lodash'

export default {

  mounted() {
    if(JSON.parse(sessionStorage.getItem('weatherApp'))) {
      JSON.parse(sessionStorage.getItem('weatherApp')).map(city => this.getCityInfoByID(city))  
    }  
  },
  setup() {
    let searchCity = ref('')
    let cities = ref([])
    let citiesWeatherInfo = ref([])
    let disabledUpdate = ref(false)

    let handlingCitiesInfo = (response) => {
      if(response) {
        citiesWeatherInfo.value.push(response.data)
        citiesWeatherInfo.value = _.uniqBy(citiesWeatherInfo.value, 'id')
        sessionStorage.setItem('weatherApp', JSON.stringify(citiesWeatherInfo.value))
      }
    }

    const getCityInfoByID = async (city) => {
      cities.value= []
      searchCity.value = ''
      let response = await fetchByID(city)
      handlingCitiesInfo(response)
    }

    const getCityInfoByName = async () => {
      let response = await api.requestCityInfoByName(searchCity.value)
      searchCity.value = ''
      handlingCitiesInfo(response)
    } 

    const removeCity = (id) => {
      citiesWeatherInfo.value = citiesWeatherInfo.value.filter(city => city.id !== id)
      sessionStorage.setItem('weatherApp', JSON.stringify(citiesWeatherInfo.value))
    }

    const updateCitiesInfo = () => {
      disabledUpdate.value = true
      let wasUpdateCities = citiesWeatherInfo.value
      citiesWeatherInfo.value = []
      wasUpdateCities.map(city => getCityInfoByID(city))

      let disabledTimeOut = setTimeout(() => {
        disabledUpdate.value = false
        clearTimeout(disabledTimeOut)
      }, 300000)
    }

    return {
      searchCity,
      getCityInfoByID,
      getCityInfoByName,
      citiesWeatherInfo,
      removeCity,
      updateCitiesInfo,
      disabledUpdate
    }
  }
}
</script>

<style lang="scss">
.container {
  text-align: center;
  width: 320px;
  margin: 60px auto;

  .search {
    position: relative;
    display: flex;
    align-items: center;
    input {
      width: 100%;
      height: 40px;
      border: none;
      box-shadow: 0px 5px 5px -5px rgba(34, 60, 80, 0.6);
      font-size: 20px;
      padding: 0 10px;
      box-sizing: border-box;

      &:focus {
        box-shadow: 0px 5px 5px -5px rgba(100, 210, 36, 0.6);
        outline: none;
      }
    }

    &__btn {
      cursor: pointer;
      border-radius: 3px;
      height: 30px;
    }
  }
  .weather {
    &__city-list {
      padding: 0;
      li {
        list-style: none;
        font-size: 18px;
        padding: 5px;
        text-align: left;
        display: flex;
        justify-content: flex-end;
      }
    }
    &__city-remove {
      position: relative;
      cursor: pointer;
      margin-left: 10px;
    }
    &__city-name {
      margin-right: auto;
    }
    &__update {
      cursor: pointer;
    }
  }
}
</style>
