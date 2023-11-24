import React from 'react';
import { CiLocationOn } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaInstagramSquare } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

const Footer = () => {
   return (
      <div className='w-full mt-20 px-28'>
         <div className='flex justify-between gap-3'>
            <div className='flex-1'>
               <h3 className='text-green leading-6 font-bold text-xl'>Nền tảng xã hội</h3>
               <p className='text-[#7A7E9A] leading-6 mt-5'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum
               </p>
               <div className='mt-4 flex gap-3'>
                  <FaFacebookF className='text-green bg-green-200 rounded-full p-1' size={28} />
                  <FaTwitter className='text-green bg-green-200 rounded-full p-1' size={28} />
                  <IoLogoLinkedin className='text-green bg-green-200 rounded-full p-1' size={28} />
                  <FaInstagramSquare className='text-green bg-green-200 rounded-full p-1' size={28} />
               </div>
            </div>
            <div className='flex-1'>
               <h3 className='text-green leading-6 font-bold text-xl'>Đội ngũ hổ trợ</h3>
               <div className='flex flex-col mt-5 text-[#7A7E9A] leading-6 gap-4'>
                  <p>Help and Ordering</p>
                  <p>Return & Cancellation</p>
                  <p>Delevery Schedule</p>
                  <p>Online Enquiry</p>
               </div>
            </div>
            <div className='flex-1'>
               <h3 className='text-green leading-6 font-bold text-xl'>Đội ngũ hổ trợ</h3>
               <div className='flex flex-col mt-5 text-[#7A7E9A] leading-6 gap-4'>
                  <p>Help and Ordering</p>
                  <p>Return & Cancellation</p>
                  <p>Delevery Schedule</p>
                  <p>Online Enquiry</p>
               </div>
            </div>
            <div className='flex-1'>
               <h3 className='text-green leading-6 font-bold text-xl'>Liên hệ trực tiếp tại</h3>
               <div className='mt-5'>
                  <div className='flex items-center gap-2 text-green'><CiLocationOn size={20} /> <span>Localtion</span></div>
                  <p className='text-[#7A7E9A] leading-6 text-sm mt-2'>Gamming house Điện bàn, Quảng Nam, Việt Nam</p>
               </div>
               <div className='mt-5'>
                  <div className='flex items-center gap-2 text-green'><IoCallOutline size={20} /> <span>CALL</span></div>
                  <p className='text-[#7A7E9A] leading-6 text-sm mt-2'>0368987565</p>
               </div>
               <div className='mt-5'>
                  <div className='flex items-center gap-2 text-green'><MdOutlineEmail size={20} /> <span>Localtion</span></div>
                  <p className='text-[#7A7E9A] leading-6 text-sm mt-2'>suppluchain@gmail.com</p>
               </div>
            </div>
         </div>
         <div className='border-dotted border-t-2 border-green-300 mt-7' />
         <div className='flex items-center justify-between my-7 text-[#7A7E9A]'>
            <p>Copyright @2023. Ngô Viết Thành - 19IT6 - 19IT443</p>
            <p>Terms & Conditions Privacy Policy</p>
         </div>
      </div>
   )
}

export default Footer