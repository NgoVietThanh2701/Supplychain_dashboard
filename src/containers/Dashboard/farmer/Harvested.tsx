import { ethers } from 'ethers';
import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import DataTable from '../../../components/Dashboard/DataTable';
import HarvestedModal from '../../../components/Dashboard/farmer/HarvestedModal';
import Swal from 'sweetalert2';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import StateProduct from '../../../utils/data/statesProduct';
import { formatTime, formatToEth } from '../../../utils/function/format';
import { useSelector } from 'react-redux';
import { useStateContext } from '../../../contexts/ContextProvider';

const nodata_img = require('../../../utils/images/no-data.jpg');

const Harvested = () => {

   const { currentColor } = useStateContext();

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const { currentUser } = useSelector((state: any) => state.user);

   const [products, setProducts] = useState<any>([]);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const getProducts = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.Harvested &&
            data.farmerDetails.farmerCode === currentUser?.code));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProducts(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const convertObjectProduct = (data: any) => {
      return {
         uid: data.uid.toNumber(),
         productState: data.productSatte,
         name: data.productDetails.name,
         code: data.productDetails.code,
         price: formatToEth(data.productDetails.price),
         category: data.productDetails.category,
         images: data.productDetails.images,
         description: data.productDetails.description,
         quantity: data.productDetails.quantity.toNumber(),
         temp: data.productDetails.temp,
         humidity: data.productDetails.humidity,
         date: data.productDetails.date.toNumber()
      }
   }

   useEffect(() => {
      if (currentUser?.code) {
         getProducts();
      }
   }, [currentUser?.code]);

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
            <button onClick={handleAddProduct} className='text-white py-[7px] text-sm px-[10px] rounded-lg' style={{ backgroundColor: currentColor }}>
               Thêm sản phẩm</button>
         </div>
         {products.length > 0 ?
            <DataTable columns={columnFM} rows={products} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
         }
      </div>
   )
}

export default Harvested;

const columnFM = [
   {
      field: 'uid',
      headerName: 'ID',
      width: 40
   },
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
      width: 100
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
      headerName: 'Ngày sản xuất',
      width: 100,
      renderCell: (params: any) => (
         <span>
            {formatTime(params.row.date * 1000)}
         </span>
      )
   },
]