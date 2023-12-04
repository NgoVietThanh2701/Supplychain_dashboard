import axiosConfig from '../app/axiosConfig'

export const apigetUsers = async () => {
   const response = await axiosConfig({
      method: 'GET',
      url: '/api/v1/admin/users'
   });
   return response
}

export const apigetSingleUser = async (code: String) => {
   const response = await axiosConfig({
      method: 'GET',
      url: `/api/v1/admin/user/${code}`
   });
   return response
}

export const apigetRequestUsers = async () => {
   const response = await axiosConfig({
      method: 'GET',
      url: '/api/v1/admin/requests'
   });
   return response
}

export const apiApproveRequest = async (code: string) => {
   const response = await axiosConfig({
      method: 'PATCH',
      url: `/api/v1/admin/approve/${code}`,
   });
   return response;
}

export const apiDeleteRequest = async (code: string) => {
   const response = await axiosConfig({
      method: 'DELETE',
      url: `/api/v1/admin/delete/${code}`,
   });
   return response;
}