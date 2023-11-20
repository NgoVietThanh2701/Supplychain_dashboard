import axiosConfig from '../app/axiosConfig'

export const apiRegister = async (data: any) => {
   const response = await axiosConfig({
      method: 'POST',
      url: '/api/v1/auth/register',
      data: data
   });
   return response.data;
}

export const apiVerifyOTP = async (data: any) => {
   const response = await axiosConfig({
      method: 'POST',
      url: '/api/v1/auth/verify-otp',
      data: data
   })
   return response.data;
}

export const apiLogin = async (data: any) => {
   const response = await axiosConfig({
      method: 'POST',
      url: '/api/v1/auth/login',
      data: data
   });
   return response;
}