import React, { useState } from 'react';
import { useStateContext } from '../../../contexts/ContextProvider';
import { HiOutlineViewfinderCircle } from 'react-icons/hi2';
import ModalViewProduct from '../ModalViewProduct';
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import AGTContract from '../../../contracts/AGTContract';
import Loading from '../../Loading';
import SupplyChainContract from '../../../contracts/SupplyChainContract';

const ProductCard = ({ data, getProducts }: any) => {

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();

   const { currentColor } = useStateContext();

   const [isOpenModal, setIsOpenModal] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const handleBuyProduct = async (uid: number, price: any) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      setIsLoading(true);
      const supplychainContract = new SupplyChainContract(web3Provider);
      const agtContract = new AGTContract(web3Provider);
      await agtContract.approve(supplychainContract._contractAddress, price);
      await supplychainContract.purchaseByThirdParty(uid);
      setTimeout(() => {
         getProducts();
      }, 2500);
      setIsLoading(false);
   }

   const openModal = () => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      setIsOpenModal(true)
   }

   return (
      <div className='border-item-product py-2 flex flex-col items-center gap-2 group relative'>
         {isOpenModal && <ModalViewProduct setIsOpenModal={setIsOpenModal} product={data} />}
         {isLoading && <Loading />}
         <button onClick={openModal} className='p-[10px] rounded-full bg-[#49A760] absolute z-10 top-2 right-0 opacity-0 group-hover:opacity-100 transition-all group-hover:transform group-hover:translate-x-[-30%] duration-300'>
            <HiOutlineViewfinderCircle size={20} color='white' />
         </button>
         <div className='w-40 h-40'>
            <img src={data.images} className='w-full h-full object-cover' />
         </div>
         <h3 className='text-lg text-[#616161] font-bold'>{data.name}</h3>
         <span className='text-green font-bold '>$ {data.price} AGT</span>
         <button onClick={() => handleBuyProduct(data.uid, data.price)} className={`text-white rounded-md px-3 py-1`} style={{ backgroundColor: currentColor }} >Thu mua</button>
      </div>
   )
}

const ProductTPT = ({ dataProduct, getProducts }: any) => {

   console.log(dataProduct)

   return (
      <div className='w-11/12 flex flex-col items-center gap-4 mt-2 py-2 mx-auto'>
         <h3 className='text-333 font-medium'>Thu mua sản phẩm chất lượng cao, giá rẻ tại đây</h3>
         <div className='w-full flex flex-wrap -m-2'>
            {dataProduct?.map((data: any) => (
               <div key={data.uid} className='w-1/4 p-2'>
                  <ProductCard data={data} getProducts={getProducts} />
               </div>
            ))}
         </div>
      </div>
   )
}

export default ProductTPT