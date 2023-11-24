import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LiaGripfire } from 'react-icons/lia';
import { IoIosArrowDown } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { IoSearchSharp } from "react-icons/io5";
import { TbLayoutDashboard } from "react-icons/tb";
import path from '../../utils/data/path';

const Header = () => {
   return (
      <div className='w-5/6 h-[80px] bg-white flex items-center justify-between px-5 rounded-lg'>
         <div>
            <Link to='/' className=' flex items-center'>
               <LiaGripfire size={38} className='text-green' />
               <span className='text-green text-xl font-bold'>AGRICHAIN</span>
            </Link>
         </div>
         <ul className='flex gap-6'>
            <div className='group relative cursor-pointer'>
               <div className='flex items-center justify-center gap-[2px]'>
                  Home <IoIosArrowDown size={13} className='text-primary2' />
               </div>
               <ul className='w-60 bg-white opacity-0 group-hover:opacity-100 absolute z-10 mt-7 shadow-md px-5 py-6 transform transition duration-300'>
                  <Link to='' className='block py-2'>home 1</Link>
                  <Link to='' className='block py-2 hover:text-green'>home 2</Link>
               </ul>
               <div className=" z-10 h-7 w-52 absolute top-full left-0"></div>
            </div>
            <NavLink to={path.SHOP}>
               Shop
            </NavLink>
            <NavLink to=''>
               Contract
            </NavLink>
            <NavLink to=''>
               Login
            </NavLink>
         </ul>
         <div className='flex items-center gap-2'>
            <div className=' border-gray-300 rounded-md p-2 text-333'>
               Customer (0xaa..43) <span className='text-green font-medium'>2,6 AGT</span>
            </div>
            <div className='border-1 border-gray-300 rounded-md p-2 hover:bg-bg-green text-666 hover:text-white'>
               <IoSearchSharp size={18} />
            </div>
            <div className='relative border-1 border-gray-300 rounded-md p-2 hover:bg-bg-green text-666 hover:text-white'>
               <BsCart size={18} />
               <span className='absolute top-0 right-0 bg-bg-green text-white w-4 text-center rounded-full text-xs'>2</span>
            </div>
            <div className='border-1 border-gray-300 rounded-md p-2 hover:bg-bg-green text-666 hover:text-white'>
               <TbLayoutDashboard size={18} />
            </div>
         </div>
      </div>
   )
}

export default Header