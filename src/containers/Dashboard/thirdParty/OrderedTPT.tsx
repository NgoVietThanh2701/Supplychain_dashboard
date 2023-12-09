import { useEffect, useState } from 'react'
import Loading from '../../../components/Loading';
import DataTable from '../../../components/Dashboard/DataTable';
import Swal from 'sweetalert2';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import StateProduct from '../../../utils/data/statesProduct';
import { formatToEth } from '../../../utils/function/format';
import { column3 } from '../../../utils/data/colums';
import { useSelector } from 'react-redux';

const nodata_img = require('../../../utils/images/no-data.jpg');

const OrderedTPT = () => {
   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const [products, setProducts] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(false);
   const { currentUser } = useSelector((state: any) => state.user);

   const getProducts = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.PurchasedByCustomer && data.thirdPartyDetails
            .thirdParty === currentUser?.addressWallet));
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
         productState: data.productState,
         name: data.productDetails.name,
         feeShip: formatToEth(data.productDetails.feeShip),
         code: data.productDetails.code,
         price: formatToEth(data.productDetails.price),
         priceTPT: formatToEth(data.productDetails.priceThirdParty),
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
      if (currentUser?.addressWallet) {
         getProducts();
      }
   }, [currentUser?.addressWallet]);

   const handleOrder = async (uid: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         await supplychainContract.shipByThirdParty(uid);
         setTimeout(() => {
            getProducts();
         }, 2500)
         setIsLoading(false);
      } catch (error) {
         setIsLoading(false)
         console.log(error)
      }
   }

   const action = {
      field: 'action',
      headerName: 'Thao tác',
      width: 80,
      renderCell: (params: any) => (
         <button onClick={() => handleOrder(params.row.uid)} className='text-white bg-bg-green rounded-md px-3 py-1'>
            Gửi
         </button>

      )
   }

   return (
      <div className='w-auto bg-white mx-5 px-5 py-5 mt-14 rounded-lg'>
         {isLoading && <Loading />}
         <div className='flex items-center justify-between'>
            <h3 className='text-444 text-xl font-medium mb-5'>Danh sách đơn đặt hàng</h3>
         </div>
         {products.length > 0 ?
            <DataTable columns={column3.concat(action)} rows={products} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
         }
      </div>
   )
}

export default OrderedTPT