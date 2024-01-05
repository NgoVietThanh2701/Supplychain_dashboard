import React, { useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import InputForm from '../../Public/InputForm';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import { useOutletContext } from 'react-router-dom';
import { ethers } from 'ethers';
import Loading from '../../Loading';
import validate from '../../../utils/function/validateField';
import { SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from '../../../contracts/config';
import { useStateContext } from '../../../contexts/ContextProvider';

const SellProductModal = ({ setIsOpenModal, uid, getProductsReceived, getProducts }: any) => {

   const { currentColor } = useStateContext();

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();

   const [isLoading, setIsLoading] = useState(false);
   const [invalidFields, setInvalidFields] = useState<any>([]);
   const [payload, setPayload] = useState({
      price: ''
   });

   const handleSellProduct = async () => {
      let invalids = validate(payload, setInvalidFields);
      if (invalids === 0) {
         try {
            setIsLoading(true);
            const supplychainContract = new SupplyChainContract(web3Provider);
            listenEvent();
            await supplychainContract.sellByThirdParty(uid, Number.parseFloat(payload.price));
         } catch (error) {
            console.log(error)
            setIsLoading(false);
            setIsOpenModal(false);
         }
      }
   }

   const listenEvent = () => {
      let contract = new ethers.Contract(SUPPLYCHAIN_ADDRESS, getAbiSupplyChain(), web3Provider);
      contract.once("SoldByThirdParty", (uid) => {
         setIsLoading(false);
         setIsOpenModal(false);
         getProductsReceived();
         getProducts();
      })
   }

   return (
      <div className='bg-half-transparent nav-item w-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
         {isLoading && <Loading />}
         <div className='bg-white w-[400px] relative group rounded-md p-5 flex flex-col gap-5 mb-48'>
            <button className='absolute top-2 right-2 text-444' onClick={() => setIsOpenModal(false)}>
               <IoCloseCircleOutline size={24} />
            </button>
            <h3 className='text-333 font-medium text-xl'>Thêm giá bán</h3>
            <InputForm
               setInvalidFields={setInvalidFields}
               invalidFields={invalidFields}
               label='Nhập giá bán cho sản phẩm'
               value={payload.price}
               setValue={setPayload}
               keyPayload='price'
            />
            <button onClick={handleSellProduct} className='text-white px-3 py-1 mx-auto rounded-md' style={{ backgroundColor: currentColor }}>
               Đăng bán
            </button>
         </div>
      </div>
   )
}

export default SellProductModal