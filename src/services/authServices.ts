import axiosConfig from '../app/axiosConfig'

export const apiRegister = async (data: any) => {
   const response = await axiosConfig({
      method: 'POST',
      url: '/api/v1/auth/register',
      data: data
   });
   return response;
}

export const apiVerifyOTP = async (data: any) => {
   const response = await axiosConfig({
      method: 'POST',
      url: '/api/v1/auth/verify-otp',
      data: data
   })
   return response;
}

export const apiLogin = async (data: any) => {
   const response = await axiosConfig({
      method: 'POST',
      url: '/api/v1/auth/login',
      data: data
   });
   return response;
}

export const apiRefreshToken = async (refreshToken: any) => {
   const response = await axiosConfig({
      method: 'POST',
      url: '/api/v1/auth/refresh-token',
      data: { refreshToken }
   });
   return response;
}
