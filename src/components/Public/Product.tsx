import React from 'react';
import { FaStar } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { Link } from 'react-router-dom';

const ProductCard = ({ product }: any) => {
   return (
      <div className='border-item-product py-3 flex flex-col items-center gap-3 group relative'>
         <Link to={`/single-product/${product.code}`} className='p-[10px] rounded-full bg-[#49A760] absolute z-10 top-4 right-0 opacity-0 group-hover:opacity-100 transition-all group-hover:transform group-hover:translate-x-[-30%] duration-300'>
            <HiOutlineViewfinderCircle size={20} color='white' />
         </Link>
         <div className='w-44 h-44'>
            <img src={product.images} className='w-full h-full object-contain' />
         </div>
         <div className='relative flex justify-center border-t-1 border-color mt-3'>
            <div className='bg-white px-4 flex absolute top-[-10px]'>
               {Array.from({ length: 5 }, (value: any, index: any) => (
                  <FaStar key={index} size={16} color='#f4a708' />
               ))}
            </div>
         </div>
         <h3 className='text-lg text-[#616161] px-4 font-bold line-clamp-1'>{product.description}</h3>
         <span className='text-green font-bold '>$ {product.priceTPT} AGT</span>
      </div>
   )
}

const Product = ({ dataProduct }: any) => {

   return (
      <div className='w-5/6 flex flex-col items-center gap-4 mt-10 py-7'>
         <p className='text-green'>GHÉ TẠI ĐÂY</p>
         <h3 className='text-4xl text-333 font-bold'>Mua sản phẩm của chúng tôi</h3>
         <p className='text-666 text-center px-72 leading-7'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut laboreonsectetur adipiscinet dolore.</p>
         <div className='w-full flex flex-wrap -m-2'>
            {dataProduct?.map((product: any) => (
               <div key={product.uid} className='w-1/5 p-2'>
                  <ProductCard product={product} />
               </div>
            ))}
         </div>
      </div>
   )
}

export default Product