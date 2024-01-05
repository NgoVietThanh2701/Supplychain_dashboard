import React, { useEffect, useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5'
import { useStateContext } from '../../../contexts/ContextProvider';
import { apigetLocation } from '../../../services/farmerServices';
import { formatTime } from '../../../utils/function/format';

const ModalViewProduct = ({ setIsOpenModal, product }: any) => {

   const { currentColor } = useStateContext();

   const [localtion, setLocation] = useState('');

   const getLocation = async () => {
      try {
         const response = await apigetLocation(Number.parseFloat((product.farmerDetails.latitude)), Number.parseFloat((product.farmerDetails.longitude)));
         setLocation(response);
         return response
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      getLocation();
   }, [getLocation])

   return (
      <div className='bg-half-transparent nav-item w-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
         <div className='bg-white w-[670px] relative group rounded-md py-5 px-6 flex flex-col gap-5 mb-16'>
            <button className='absolute top-2 right-2 text-444' onClick={() => setIsOpenModal(false)}>
               <IoCloseCircleOutline size={24} />
            </button>
            <h3 className='text-333 font-medium text-xl'>Thông tin sản phẩm</h3>
            <div className='flex gap-5'>
               <div className='w-2/5 h-48'>
                  <img src={product.images} alt="" className='w-full h-full object-cover' />
               </div>
               <div className='w-3/5 flex flex-col gap-2'>
                  <h3 className='text-[#616161] text-xl font-semibold'>Tên: {product.name}</h3>
                  <span className='line-clamp-3'>{product.description}</span>
                  <span className='text-green font-bold text-lg py-1'>Giá: {product.price} AGT</span>
                  <span className='text-444'>Số lượng: {product.quantity} Kg</span>
                  <button className={`text-white rounded-md px-3 py-1 mt-2 w-32 mx-auto`} style={{ backgroundColor: currentColor }} >Thu mua</button>
               </div>
            </div>
            <div className='flex flex-col text-444 gap-[6px]'>
               <h3 className='bg-[#F5F5F5] text-[#616161] p-2 rounded-md'>CHI TIẾT SẢN PHẨM</h3>
               <div className='flex items-center gap-12 pl-2 mt-3'>
                  <span>Nơi sản xuất:  {localtion}</span>
                  <span> Ngày sản xuất: {formatTime(product.date * 1000)}</span>
               </div>
               <div className='flex items-center gap-12 pl-2'>
                  <span>Nhiệt độ: {product.temp} độ C</span>
                  <span>Độ ẩm: {product.humidity} %</span>
               </div>
               <span className='pl-2'>Loại: {product.category}</span>
            </div>
         </div>
      </div>
   )
}

export default ModalViewProduct