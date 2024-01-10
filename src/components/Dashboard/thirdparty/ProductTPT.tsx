import React, { useCallback, useState } from 'react';
import { useStateContext } from '../../../contexts/ContextProvider';
import { HiOutlineViewfinderCircle } from 'react-icons/hi2';
import ModalViewProduct from './ModalViewProduct';
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import AGTContract from '../../../contracts/AGTContract';
import Loading from '../../Loading';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import { SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from '../../../contracts/config';
import { useSelector } from 'react-redux';
import { apiCreateStatistical } from '../../../services/statistical';

const ProductCard = ({ data, getProducts }: any) => {

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const { currentUser } = useSelector((state: any) => state.user);

   const { currentColor } = useStateContext();

   const [isOpenModal, setIsOpenModal] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const handleBuyProduct = async (uid: number, price: any) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         const agtContract = new AGTContract(web3Provider);
         await agtContract.approve(supplychainContract._contractAddress, price);
         listenEvent();
         await supplychainContract.purchaseByThirdParty(uid, currentUser?.code);
         const currentDate = new Date();
         await apiCreateStatistical({ code: currentUser.code, revenue: 0, spend: price, dateOfWeek: currentDate });
      } catch (error) {
         console.log(error)
         setIsLoading(false);
      }
   }

   const listenEvent = () => {
      let contract = new ethers.Contract(SUPPLYCHAIN_ADDRESS, getAbiSupplyChain(), web3Provider);
      contract.once("PurchasedByThirdParty", (uid) => {
         setIsLoading(false);
         getProducts();
      })
   }

   const openModal = () => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      setIsOpenModal(true)
   }

   return (
      <div className='border-item-product pt-1 pb-2 flex flex-col rounded-md items-center gap-1.5 group relative bg-white'>
         {isOpenModal && <ModalViewProduct setIsOpenModal={setIsOpenModal} product={data} handleBuyProduct={handleBuyProduct} />}
         {isLoading && <Loading />}
         <button onClick={openModal} className='p-[10px] rounded-full bg-[#49A760] absolute z-10 top-2 right-0 opacity-0 group-hover:opacity-100 transition-all group-hover:transform group-hover:translate-x-[-30%] duration-300'>
            <HiOutlineViewfinderCircle size={20} color='white' />
         </button>
         <div className='w-48 h-36'>
            <img src={data.images} className='w-full h-full object-cover' />
         </div>
         <h3 className='text-lg text-[#616161] font-bold'>{data.name}</h3>
         <span className='text-green font-bold '>$ {data.price} AGT</span>
         <button onClick={() => handleBuyProduct(data.uid, data.price)} className={`text-white rounded-md px-3 py-1`}
            style={{ backgroundColor: currentColor }} >Thu mua</button>
      </div>
   )
}

const ProductTPT = ({ dataProduct, getProducts }: any) => {

   return (
      <div className='w-11/12 flex flex-col items-center gap-4 mt-2 py-2 mx-auto'>
         <h3 className='text-333 font-medium'>Thu mua sản phẩm chất lượng cao, giá rẻ tại đây</h3>
         <div className='w-full flex flex-wrap -m-2'>
            {dataProduct?.map((data: any) => (
               <div key={data.uid} className='w-1/5 p-2'>
                  <ProductCard data={data} getProducts={getProducts} />
               </div>
            ))}
         </div>
      </div>
   )
}

export default ProductTPT