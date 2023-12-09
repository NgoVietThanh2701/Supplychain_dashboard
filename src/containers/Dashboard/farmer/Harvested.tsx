import { ethers } from 'ethers';
import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import DataTable from '../../../components/Dashboard/DataTable';
import HarvestedModal from '../../../components/Dashboard/farmer/HarvestedModal';
import Swal from 'sweetalert2';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import StateProduct from '../../../utils/data/statesProduct';
import { formatToEth } from '../../../utils/function/format';
import { column1 } from '../../../utils/data/colums';
import { useSelector } from 'react-redux';

const nodata_img = require('../../../utils/images/no-data.jpg');

const Harvested = () => {

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const { currentUser } = useSelector((state: any) => state.user);

   const [products, setProducts] = useState<any>([]);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const getProducts = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.Harvested && data.farmerDetails.farmer === currentUser?.addressWallet));
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
      if (currentUser?.address) {
         getProducts();
      }
   }, [currentUser?.address]);

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
            <DataTable columns={column1} rows={products} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
         }
      </div>
   )
}

export default Harvested;