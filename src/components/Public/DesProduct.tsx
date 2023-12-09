import { useState } from 'react';
import { FaStar } from "react-icons/fa";
import { CiChat1 } from "react-icons/ci";
import { CiShop } from "react-icons/ci";
import Swal from 'sweetalert2';
import SupplyChainContract from '../../contracts/SupplyChainContract';
import { useNavigate } from 'react-router-dom';
import path from '../../utils/data/path';
import Loading from '../Loading';
import AGTContract from '../../contracts/AGTContract';

const DesProduct = ({ product, onConnectMetamask, address, web3Provider }: any) => {

   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();

   const handleBuyProduct = async (uid: number, priceTPT: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         const agtContract = new AGTContract(web3Provider);
         await agtContract.approve(supplychainContract._contractAddress, priceTPT + 30)
         await supplychainContract.purchaseByCustomer(uid, 30);
         setIsLoading(false);
         setTimeout(() => {
            navigate(path.SHOP);
         }, 2500)
      } catch (error) {
         setIsLoading(false)
         console.log(error)
      }
   }

   return (
      <div className='w-5/6 mt-20'>
         {isLoading && <Loading />}
         <div className='flex gap-7'>
            <div className='w-2/5 border-1 border-color bg-background-slide'>
               <img src={product?.images} className='w-full h-full object-contain' alt="" />
            </div>
            <div className='w-3/5 flex flex-col pt-5 gap-5'>
               <p className='text-333 leading-8 text-xl'>[{product?.description}]</p>
               <h3 className='text-3xl font-bold text-333'>{product?.name}</h3>
               <p className='text-444 font-medium text-xl'>Giá:  {product?.priceTPT} GPT</p>
               <p className='text-444 font-medium text-xl'>Số lượng:  {product?.quantity} Kg</p>
               <div className='flex gap-1 items-center'>
                  {Array.from({ length: 5 }, (value: any, index: any) => (
                     <FaStar key={index} size={16} color='#f4a708' />
                  ))}
                  <span className='text-666 underline'>3 review</span>
               </div>
               <div className='flex gap-2 items-center mt-3'>
                  <input type='checkbox' id='terms' />
                  <label className='text-666' htmlFor="terms">Tôi đồng ý với mọi điều khoản và điều kiện.</label>
               </div>
               <button onClick={() => handleBuyProduct(product?.uid, product?.priceTPT)} className='px-5 py-2 bg-bg-green rounded-xl text-white ml-5 mx-auto'>Mua ngay</button>
               {address ? <p className='text-green text-lg'>Kết nối ví thành công !</p> :
                  <button className='text-[#C82032] text-lg block'
                     onClick={onConnectMetamask}>Vui lòng kết nối ví</button>
               }
            </div>
         </div>
         <div className='mt-10 flex bg-[#F5F5F5] py-3 px-5 gap-5 rounded-md'>
            <div className='w-16 h-16'>
               <img src={product?.images} className='w-full h-full object-cover rounded-full' alt="" />
            </div>
            <div className='flex flex-col justify-around'>
               <h3 className='text-333'>Người bán: </h3>
               <div className='flex items-center gap-3'>
                  <button className='inline-flex items-center gap-1 text-333 border border-green-300 px-2 py-1 rounded-md text-sm'><CiChat1 />Chat ngay </button>
                  <button className='inline-flex items-center gap-1 text-333 border border-green-300 px-2 py-1 rounded-md text-sm'><CiShop />Xem shop </button>
               </div>
            </div>
         </div>
         <div className='flex'>
            <div className='w-3/5 flex flex-col gap-2'>
               <h3 className='text-333 mt-7 text-xl'>CHI TIẾT SẢN PHẨM</h3>
               <div className='flex mt-3'>
                  <span className='w-44'>Loại</span>
                  <span>{product?.category}</span>
               </div>
               <div className='flex'>
                  <span className='w-44'>Số lượng</span>
                  <span>{product?.quantity}</span>
               </div>
               <div className='flex'>
                  <span className='w-44'>Nhiệt độ </span>
                  <span>{product?.temp} độ C</span>
               </div>
               <div className='flex'>
                  <span className='w-44'>Độ ẩm</span>
                  <span>{product?.humidity} %</span>
               </div>
            </div>
            <div className='w-2/5'>
               map
            </div>
         </div>
      </div>
   )
}

export default DesProduct