import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LiaGripfire } from 'react-icons/lia';
import { IoIosArrowDown } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { IoSearchSharp } from "react-icons/io5";
import { TbLayoutDashboard } from "react-icons/tb";
import path from '../../utils/data/path';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshTokenThunk, resetAuth } from '../../features/authSlice';
import { resetCurrentUser } from '../../features/userSlice';
import roles from '../../utils/data/roles';
import checkTokenExpired from '../../utils/function/checkTokenExpired';
import { showShortAddress } from '../../utils/function/format';
import ModalSaleToken from '../Dashboard/ModalSaleToken';

const Header = () => {

   const { refreshToken, token, isLoggedIn } = useSelector((state: any) => state.auth);
   const { currentUser } = useSelector((state: any) => state.user);

   const [isOpenModal, setIsOpenModal] = useState(false);

   const dispatch = useDispatch<any>();
   const navigate = useNavigate();

   const goLogout = useCallback(() => {
      dispatch(resetAuth());
      dispatch(resetCurrentUser());
      navigate('/');
   }, [dispatch, navigate]);

   useEffect(() => {
      if (token) {
         if (checkTokenExpired(refreshToken)) {
            goLogout();
         } else if (checkTokenExpired(token)) {
            dispatch(refreshTokenThunk(refreshToken));
         }
      }
   }, [dispatch, goLogout, refreshToken, token]);

   useEffect(() => {
      if (isLoggedIn && ((currentUser?.role === roles[roles.admin]) || currentUser?.role === roles[roles.farmer] || currentUser?.role === roles[roles.thirdparty] || currentUser?.role === roles[roles.deliveryhub])) {
         navigate(`${path.DASHBOARD}`);
      }
   }, [currentUser?.role, isLoggedIn, navigate])

   // modal
   const handleModal = () => {
      setIsOpenModal(true);
   }

   return (
      <div className='w-5/6 h-[80px] bg-white flex items-center justify-between px-5 rounded-lg'>
         {isOpenModal && <ModalSaleToken setIsOpenModal={setIsOpenModal} />}
         <div>
            <Link to='/' className=' flex items-center'>
               <LiaGripfire size={38} className='text-green' />
               <span className='text-green text-xl font-bold'>AGRICHAIN</span>
            </Link>
         </div>
         <ul className='flex gap-6'>
            <NavLink to='/'>
               Trang chủ
            </NavLink>
            <button onClick={handleModal}>modal</button>
            {!currentUser &&
               (<div className='group relative cursor-pointer'>
                  <div className='flex items-center justify-center gap-[2px]'>
                     Đăng nhập <IoIosArrowDown size={13} className='text-primary2' />
                  </div>
                  <ul className='w-60 bg-white hidden group-hover:block absolute top-7 left-[-40%] rounded-b-md z-20 mt-6 shadow-md px-5 py-6 transform transition duration-300'>
                     <Link to={`/login/${roles[roles.customer]}`} className='block py-2 hover:text-green'>Khách hàng</Link>
                     <Link to={`/login/${roles[roles.farmer]}`} className='block py-2 hover:text-green'>Nông dân</Link>
                     <Link to={`/login/${roles[roles.thirdparty]}`} className='block py-2 hover:text-green'>Môi giới</Link>
                     <Link to={`/login/${roles[roles.deliveryhub]}`} className='block py-2 hover:text-green'>Vận chuyển</Link>
                     <Link to={`/login/${roles[roles.admin]}`} className='block py-2 hover:text-green'>Admin</Link>
                  </ul>
                  <div className=" z-10 h-7 w-52 absolute top-full left-[-15%]"></div>
               </div>
               )}
            <NavLink to={path.SHOP}>
               Cửa hàng
            </NavLink>
            {!currentUser &&
               (<div className='group relative cursor-pointer'>
                  <div className='flex items-center justify-center gap-[2px]'>
                     Đăng ký <IoIosArrowDown size={13} className='text-primary2' />
                  </div>
                  <ul className='w-60 bg-white hidden group-hover:block absolute top-7 left-[-40%]  rounded-b-md z-20 mt-6 shadow-md px-5 py-6 transform transition duration-300'>
                     <Link to={`/register/${roles[roles.customer]}`} className='block py-2 hover:text-green'>Khách hàng</Link>
                     <Link to={`/register/${roles[roles.farmer]}`} className='block py-2 hover:text-green'>Nông dân</Link>
                     <Link to={`/register/${roles[roles.thirdparty]}`} className='block py-2 hover:text-green'>Môi giới</Link>
                     <Link to={`/register/${roles[roles.deliveryhub]}`} className='block py-2 hover:text-green'>Vận chuyển</Link>
                     <Link to={`/register/${roles[roles.admin]}`} className='block py-2 hover:text-green'>Admin</Link>
                  </ul>
                  <div className=" z-10 h-7 w-52 absolute top-full left-0"></div>
               </div>
               )}
            {currentUser &&
               <button onClick={goLogout}>Đăng xuất</button>}
         </ul>
         <div className='flex items-center gap-2'>
            {currentUser &&
               <div className=' border-gray-300 rounded-md p-2 text-333'>
                  {currentUser?.name} ({showShortAddress(currentUser?.addressWallet)}) <span className='text-green font-medium'>2,6 AGT</span>
               </div>
            }
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