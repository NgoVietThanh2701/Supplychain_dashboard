import React, { useState, useEffect } from 'react'
import DataTable from '../../../components/Dashboard/DataTable';
import { apigetUsers } from '../../../services/adminServices';
import { formatTime, showShortAddress } from '../../../utils/function/format';

const nodata_img = require('../../../utils/images/no-data.jpg');

const Users = () => {

   const [users, setUsers] = useState([]);

   const getUsers = async () => {
      try {
         const response = await apigetUsers();
         setUsers(response.data.data);
      } catch (error: any) {
         console.log(error.data)
      }
   }

   useEffect(() => {
      getUsers();
   }, []);

   return (
      <div className='w-auto bg-white mx-5 px-5 py-5 mt-14 rounded-lg h-[550px]'>
         <h3 className='text-444 text-xl font-medium mb-5'>Danh sách người dùng</h3>
         {users.length > 0 ? <DataTable columns={columns} rows={users} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} />
               Không có dữ liệu nào!
            </div>}
      </div>
   )
}

export default Users

const columns = [
   {
      field: 'code',
      headerName: 'ID',
      width: '',
   },
   {
      field: 'name',
      headerName: 'Tên',
      width: 120
   },
   {
      field: 'email',
      headerName: 'Email',
      width: 200
   },
   {
      field: 'description',
      headerName: 'Mô tả',

   },
   {
      field: 'addressWallet',
      headerName: 'Địa chỉ ví',
      width: 180,
      renderCell: (params: any) => (
         <span>
            {showShortAddress(params.row.addressWallet, 10)}
         </span>
      )
   },
   {
      field: 'role',
      headerName: 'Loại',
      width: 100
   },
   {
      field: 'createdAt',
      headerName: 'Ngày đăng ký',
      width: 180
   },
]