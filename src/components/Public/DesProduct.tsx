import React from 'react';
import { FaStar } from "react-icons/fa";
import { LuMinus } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";

const img = require('../../utils/images/product1.png')

const DesProduct = () => {
   return (
      <div className='w-5/6 mt-24'>
         <div className='flex gap-10'>
            <div className='flex-1 border-1 border-color bg-background-slide'>
               <div className='w-full h-[630px]'>
                  <img src={img} className='w-full h-full object-cover' alt="" />
               </div>
            </div>
            <div className='flex-1 flex flex-col justify-center gap-5'>
               <h3 className='text-3xl font-bold text-333'>Natural Organic Vegetables</h3>
               <p className='text-333 font-medium text-xl'>$ 2.68 GPT</p>
               <div className='flex gap-1 items-center'>
                  {Array.from({ length: 5 }, (value: any, index: any) => (
                     <FaStar key={index} size={16} color='#f4a708' />
                  ))}
                  <span className='text-666 underline'>3 review</span>
               </div>
               <p className='text-[#7A7E9A] leading-7 '>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et</p>
               <div className='flex items-center mt-3'>
                  <LuMinus size={34} className='text-666 px-2 border-1 border-color' />
                  <p className='border-1 border-color px-4 py-1'>0</p>
                  <FaPlus size={34} className='text-666 p-2 border-1  border-color' />
                  <button className='px-5 py-2 bg-bg-green rounded-3xl text-white ml-5'>Thêm vào giỏ hàng</button>
               </div>
               <div className='flex gap-2 items-center mt-3'>
                  <input type='checkbox' id='terms' />
                  <label className='text-666' htmlFor="terms">Tôi đồng ý với mọi điều khoản và điều kiện.</label>
               </div>
            </div>
         </div>

      </div>
   )
}

export default DesProduct