import axios from "axios";

const instance = axios.create({
   baseURL: process.env.REACT_APP_SERVER_URL,
});

instance.interceptors.request.use(async function (config: any) {
   /* Do something before is request sent */
   /* Add token in header */
   const token = localStorage.getItem('persist:auth') && JSON.parse(localStorage.getItem('persist:auth') || '')?.token?.slice(1, -1);
   config.headers = {
      authorization: `Bearer ${token}`
   }
   return config;
}, function (error) {
   /* Do something with request error */
   return Promise.reject(error)
});

export default instance