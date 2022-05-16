<template>
    <main class="container">
      <div class="search__container">
        <input 
          type="text" 
          placeholder="Enter city name" 
          v-model.trim="searchCity" 
          @input="getCities"
        />
        <ul class="search__city-list" v-if="filteredCities.length">
          <li v-for="city of filteredCities" :key="city.id">
            {{ `${city.name}, ${city.country}`}}
          </li>
        </ul>
      </div>
    </main>
</template>

<script>
import {ref, computed} from 'vue'
import api from './api'

export default {
  setup() {
    let searchCity = ref('')
    let cities = ref([])

    const getCities = async () => {
      if(searchCity.value.length > 2) {
        cities.value = await api.getCities()
      }
      else {
        cities.value= []
      }
    }

    const filteredCities = computed(() => {
      let validCityName = searchCity.value.charAt(0).toUpperCase() + searchCity.value.slice(1)
      return cities.value.filter((el) => el.name.startsWith(validCityName))
    })

    return {
      searchCity,
      getCities,
      filteredCities
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
    &__container {
      position: relative;
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
    }

    &__city-list {
      width: 100%;
      position: absolute;
      top: 30px;
      left: 0;
      padding: 0;
      max-height: 200px;
      overflow-y: scroll;
      box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);

      li {
        list-style: none;
        font-size: 18px;
        padding: 5px;
        text-align: left;

        &:hover {
          background-color: rgba(100, 210, 36, 0.2);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
