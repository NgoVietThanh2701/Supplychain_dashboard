import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import DataTable from '../../../components/Dashboard/DataTable';
import HarvestedModal from '../../../components/Dashboard/farmer/HarvestedModal';
import Swal from 'sweetalert2';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import { formatTime } from '../../../utils/function/format';

const nodata_img = require('../../../utils/images/no-data.jpg');

const Harvested = () => {

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();

   const [products, setProducts] = useState<any>([]);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const getProducts = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const listProducts = [];
         for (let i = 0; i < response.length; i++) {
            listProducts.push(convertObjectProduct(response[i].productDetails))
         }
         setProducts(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const convertObjectProduct = (data: any) => {
      return {
         name: data[0],
         code: data[1],
         price: data[2],
         category: data[5],
         images: data[6],
         description: data[7],
         quantity: data[8],
         temp: data[9],
         humidity: data[10],
         date: data[11]
      }
   }

   useEffect(() => {
      getProducts();
   }, []);

   const handleAddProduct = () => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      setIsOpenModal(true);
   }

   return (
      <div className='w-auto bg-white mx-5 px-5 py-5 mt-14 rounded-lg'>
         {isOpenModal && <HarvestedModal setIsOpenModal={setIsOpenModal} getProducts={getProducts} />}
         <div className='flex items-center justify-between'>
            <h3 className='text-444 text-xl font-medium mb-5'>Danh sách sản phẩm</h3>
            <button onClick={handleAddProduct} className='text-white bg-bg-green py-[7px] text-sm px-[10px] rounded-lg'>Thêm sản phẩm</button>
         </div>
         {products.length > 0 ?
            <DataTable columns={columns} rows={products} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
         }
      </div>
   )
}

export default Harvested;

const columns = [
   {
      field: 'code',
      headerName: 'Mã sản phẩm',
      width: 140,
   },
   {
      field: 'name',
      headerName: 'Tên',
      width: 100,
   },
   {
      field: 'images',
      headerName: 'Hình ảnh',
      renderCell: (params: any) => (
         <img className='rounded-full w-20' src={params.row.images} alt="" />
      )
   },
   {
      field: 'price',
      headerName: 'Giá (AGT)',
      width: 100
   },
   {
      field: 'category',
      headerName: 'Loại',
      width: 100
   },
   {
      field: 'description',
      headerName: 'Mô tả',
      width: 120
   },
   {
      field: 'quantity',
      headerName: 'Số lượng (Kg)',
      width: 100
   },
   {
      field: 'temp',
      headerName: 'Nhiệt độ (C)',
      width: 100
   },
   {
      field: 'humidity',
      headerName: 'Độ ẩm (%)',
      width: 80
   },
   {
      field: 'date',
      headerName: 'Ngày thu hoạch',
      width: 140,
      renderCell: (params: any) => (
         <span>
            {formatTime(params.row.date.toNumber() * 1000)}
         </span>
      )
   },
]