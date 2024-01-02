import axiosConfig from '../app/axiosConfig';

export const apiCreateStatistical = async (data: any) => {
   const response = axiosConfig({
      method: 'POST',
      url: '/api/v1/statistical/create',
      data: data
   });
   return response;
}

export const apiGetStatistical = async () => {
   const response = axiosConfig({
      method: 'GET',
      url: '/api/v1/statistical/get',
   });
   return response;
}