import axiosConfig from '../app/axiosConfig'

export const apiGetCurrentUser = async () => {
   const response = await axiosConfig({
      method: 'GET',
      url: '/api/v1/auth/getMe',
   });
   return response;
}

export const apiGetInfoUser = async (code: string) => {
   const response = await axiosConfig({
      method: 'GET',
      url: `/api/v1/auth/get-info-user/${code}`,
   });
   return response;
}