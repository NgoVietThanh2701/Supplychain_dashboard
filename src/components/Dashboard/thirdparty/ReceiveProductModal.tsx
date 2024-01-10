import React, { useState } from 'react'
import Loading from '../../Loading';
import { useStateContext } from '../../../contexts/ContextProvider';
import { apiCreateStatistical } from '../../../services/statistical';
import { ethers } from 'ethers';
import { SUPPLYCHAIN_ADDRESS, getAbiSupplyChain } from '../../../contracts/config';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import { useOutletContext } from 'react-router-dom';
import { IoCloseCircleOutline } from 'react-icons/io5';
import AutoCompleteMap from '../../AutoCompleteMap';
import validate from '../../../utils/function/validateField';

const ReceiveProductModal = ({ getProductsShipByFarmer, getProductsReceived, price, farmerCode, uid, setIsOpenModalReceive }: any) => {

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const { currentColor } = useStateContext();

   const [isLoading, setIsLoading] = useState(false);
   const [payload, setPayload] = useState({
      longitude: '',
      latitude: '',
   });
   const [invalidFields, setInvalidFields] = useState<any>([]);


   const handleConfirm = async () => {
      let invalids = validate(payload, setInvalidFields);
      if (invalids === 0) {
         try {
            setIsLoading(true);
            const supplychainContract = new SupplyChainContract(web3Provider);
            listenEvent();
            await supplychainContract.receiveByThirdParty(uid, (payload.longitude).toString(), (payload.latitude).toString());
            const currentDate = new Date();
            await apiCreateStatistical({ code: farmerCode, revenue: price, spend: 0, dateOfWeek: currentDate });
         } catch (error) {
            setIsLoading(false);
            setIsOpenModalReceive(false)
            console.log(error);
         }
      } else {
         console.log('error')
      }
   }

   const listenEvent = () => {
      let contract = new ethers.Contract(SUPPLYCHAIN_ADDRESS, getAbiSupplyChain(), web3Provider);
      contract.once("ReceivedByThirdParty", (uid) => {
         setIsLoading(false);
         setIsOpenModalReceive(false);
         getProductsShipByFarmer();
         getProductsReceived();
      })
   }

   return (
      <div className='bg-half-transparent z-10 w-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
         {isLoading && <Loading />}
         <div className='bg-white w-[400px] relative group rounded-md p-5 flex flex-col gap-5 mb-48'>
            <button className='absolute top-2 right-2 text-444' onClick={() => setIsOpenModalReceive(false)}>
               <IoCloseCircleOutline size={24} />
            </button>
            <h3 className='text-333 font-medium text-xl'>Nhập vị trí nhận hàng</h3>
            <AutoCompleteMap setPayload={setPayload} label='Nhập vị trí nhận hàng' />
            {invalidFields.length > 0 && invalidFields.some((i: any) => i.name === 'longitude') &&
               <small className='text-red-700 italic'>Thêm vị trí nhận hàng</small>
            }
            <button onClick={handleConfirm} className='text-white px-3 py-1 mx-auto rounded-md' style={{ backgroundColor: currentColor }}>
               Nhận hàng
            </button>
         </div>
      </div>
   )
}

export default ReceiveProductModal