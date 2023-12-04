import axios from 'axios';
import axiosConfig from '../app/axiosConfig';

export const apigetLocation = async (latitude: number, longitude: number) => {
   const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`)
   return `${response.data.city}, ${response.data.principalSubdivision}`
}

export const apigetWeather = async (latitude: number, longitude: number) => {
   const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_APIKEY_WEATHER}`);
   return {
      temp: response.data.main.temp - 273.15,
      humidity: response.data.main.humidity
   }
}

export const apigetCategories = async () => {
   const response = axiosConfig({
      method: 'GET',
      url: '/api/v1/category/get'
   });
   return response;
}

export const apiaddCategory = async (name: string) => {
   const response = axiosConfig({
      method: 'POST',
      url: '/api/v1/category/create',
      data: { name }
   });
   return response;
}

export const apideleteCategory = async (code: string) => {
   const response = axiosConfig({
      method: 'DELETE',
      url: `/api/v1/category/delete/${code}`
   });
   return response
}