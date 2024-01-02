import React, { useState, useEffect } from 'react'
import DataTable from '../../../components/Dashboard/DataTable';
import { apiApproveRequest, apiDeleteRequest, apigetRequestUsers, apigetSingleUser } from '../../../services/adminServices';
import { formatTime, showShortAddress } from '../../../utils/function/format';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import { useOutletContext } from "react-router-dom";
import { ethers } from 'ethers';
import roles from '../../../utils/data/roles';
import { useStateContext } from '../../../contexts/ContextProvider';

const nodata_img = require('../../../utils/images/no-data.jpg');

const RequestUsers = () => {

   const { currentColor } = useStateContext();

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();

   const [users, setUsers] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   const getUsers = async () => {
      try {
         const response = await apigetRequestUsers();
         setUsers(response.data.data);
      } catch (error: any) {
         console.log(error.data)
      }
   }

   useEffect(() => {
      getUsers();
   }, []);

   const columns = [
      {
         field: 'code',
         headerName: 'code',
         width: 120,
      },
      {
         field: 'name',
         headerName: 'Tên',
         width: 120
      },
      {
         field: 'email',
         headerName: 'Email',
         width: 220
      },
      {
         field: 'description',
         headerName: 'Mô tả',
         width: 80
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
         width: 120
      },
      {
         field: 'createdAt',
         headerName: 'Ngày đăng ký',
         width: 150,
         renderCell: (params: any) => (
            <span>{formatTime(params.row.createdAt)}</span>
         )
      },
      {
         field: 'action',
         headerName: 'Thao tác',
         width: '150',
         renderCell: (params: any) => (
            <div>
               <button onClick={() => handleApprove(params.row.code)} className='text-white rounded-md px-2 py-1' style={{ backgroundColor: currentColor }}>
                  Chấp nhận
               </button>
               <button onClick={() => handleDelete(params.row.code)} className='bg-bg-red text-white rounded-md px-2 py-1 ml-2'>
                  Xóa
               </button>
            </div>
         )
      }
   ];

   const handleApprove = async (code: string) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true);
         const response = await apigetSingleUser(code);
         const supplychainContract = new SupplyChainContract(web3Provider);
         // add blockchain
         if (response.data.data.role === roles[roles.farmer]) {
            await supplychainContract.addFarmer(response.data.data.addressWallet);
         } else if (response.data.data.role === roles[roles.thirdparty]) {
            await supplychainContract.addThirdParty(response.data.data.addressWallet);
         }
         else if (response.data.data.role === roles[roles.deliveryhub]) {
            await supplychainContract.addDeliveryHub(response.data.data.addressWallet);
         }
         else if (response.data.data.role === roles[roles.customer]) {
            await supplychainContract.addCustomer(response.data.data.addressWallet);
         } else {
            Swal.fire('Opps', 'Có lỗi xảy ra', 'error');
            return;
         }
         // add database
         await apiApproveRequest(code);
         getUsers();
         setIsLoading(false);
      } catch (error) {
         setIsLoading(false);
         console.log(error)
      }
   }

   const handleDelete = async (code: string) => {
      try {
         setIsLoading(true);
         await apiDeleteRequest(code);
         getUsers();
         setIsLoading(false);
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <div className='w-auto bg-white mx-5 px-5 py-5 mt-14 rounded-lg h-[550px]'>
         {isLoading && <Loading />}
         <h3 className='text-444 text-xl font-medium mb-5'>Danh sách người dùng đăng ký</h3>
         {users.length > 0 ?
            <DataTable columns={columns} rows={users} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} />
               Không có dữ liệu nào!
            </div>
         }
      </div>
   )
}

export default RequestUsers
