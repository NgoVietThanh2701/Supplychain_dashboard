import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LiaGripfire } from 'react-icons/lia';
import { IoIosArrowDown } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import path from '../../utils/data/path';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetAuth } from '../../features/authSlice';
import { getCurrentUser, resetCurrentUser } from '../../features/userSlice';
import roles from '../../utils/data/roles';
import checkTokenExpired from '../../utils/function/checkTokenExpired';
import { showShortAddress } from '../../utils/function/format';

const Header = () => {

   const { token, isLoggedIn } = useSelector((state: any) => state.auth);
   const { currentUser } = useSelector((state: any) => state.user);

   const dispatch = useDispatch<any>();
   const navigate = useNavigate();

   const goLogout = useCallback(() => {
      dispatch(resetAuth());
      dispatch(resetCurrentUser());
      localStorage.removeItem('supplychain_address');
      navigate('/');
   }, [dispatch, navigate]);

   useEffect(() => {
      if (token) {
         checkTokenExpired(token) && goLogout();
      }
   }, [token]);

   useEffect(() => {
      if (isLoggedIn && ((currentUser?.role === roles[roles.admin]) || currentUser?.role === roles[roles.farmer] || currentUser?.role === roles[roles.thirdparty] || currentUser?.role === roles[roles.deliveryhub])) {
         navigate(`${path.DASHBOARD}/${currentUser.role}/statistical`);
      }
   }, [currentUser?.role, isLoggedIn, navigate]);

   useEffect(() => {
      if (isLoggedIn) {
         setTimeout(() => {
            dispatch(getCurrentUser());
         }, 500)
      }
   }, [dispatch, isLoggedIn])

   return (
      <div className='w-5/6 h-[80px] bg-white flex items-center justify-between px-5 rounded-lg'>
         <Link to='/' className=' flex items-center'>
            <LiaGripfire size={38} className='text-green' />
            <span className='text-green text-xl font-bold'>AGRICHAIN</span>
         </Link>
         <ul className='flex gap-6'>
            <NavLink className={({ isActive }) => isActive ? 'border-b-2 border-green-500' : ''} to='/' key='/'>
               Trang chủ
            </NavLink>
            <NavLink to={path.SHOP} key={path.SHOP} className={({ isActive }) => isActive ? 'border-b-2 border-green-500' : ''} >
               Cửa hàng
            </NavLink>
            {!currentUser &&
               (<div className='group relative cursor-pointer'>
                  <div className='flex items-center justify-center gap-[2px]'>
                     Đăng nhập <IoIosArrowDown size={13} className='text-primary2' />
                  </div>
                  <ul className='w-60 bg-white hidden group-hover:block absolute top-7 left-[-40%] rounded-b-md z-20 mt-6 shadow-md px-5 py-6 transform transition duration-300'>
                     <Link to={`/login/${roles[roles.customer]}`} className='block py-2 hover:text-green'>Khách hàng</Link>
                     <Link to={`/login/${roles[roles.farmer]}`} className='block py-2 hover:text-green'>Người sản xuất</Link>
                     <Link to={`/login/${roles[roles.thirdparty]}`} className='block py-2 hover:text-green'>Môi giới</Link>
                     <Link to={`/login/${roles[roles.deliveryhub]}`} className='block py-2 hover:text-green'>Vận chuyển</Link>
                     <Link to={`/login/${roles[roles.admin]}`} className='block py-2 hover:text-green'>Admin</Link>
                  </ul>
                  <div className=" z-10 h-7 w-52 absolute top-full left-[-15%]"></div>
               </div>
               )}
            {!currentUser &&
               (<div className='group relative cursor-pointer'>
                  <div className='flex items-center justify-center gap-[2px]'>
                     Đăng ký <IoIosArrowDown size={13} className='text-primary2' />
                  </div>
                  <ul className='w-60 bg-white hidden group-hover:block absolute top-7 left-[-40%]  rounded-b-md z-20 mt-6 shadow-md px-5 py-6 transform transition duration-300'>
                     <Link to={`/register/${roles[roles.customer]}`} className='block py-2 hover:text-green'>Khách hàng</Link>
                     <Link to={`/register/${roles[roles.farmer]}`} className='block py-2 hover:text-green'>Người sản xuất</Link>
                     <Link to={`/register/${roles[roles.thirdparty]}`} className='block py-2 hover:text-green'>Môi giới</Link>
                     <Link to={`/register/${roles[roles.deliveryhub]}`} className='block py-2 hover:text-green'>Vận chuyển</Link>
                  </ul>
                  <div className=" z-10 h-7 w-52 absolute top-full left-0"></div>
               </div>
               )}
            <NavLink to={path.BUY_TOKEN} className={({ isActive }) => isActive ? 'border-b-2 border-green-500' : ''} key={path.BUY_TOKEN}>Mua Token</NavLink>
         </ul>
         <div className='flex items-center gap-2'>
            {
               currentUser &&
               <div className='group relative cursor-pointer'>
                  <div className='flex items-center justify-center gap-1'>
                     {currentUser?.name} ({showShortAddress(currentUser?.addressWallet, 4)})<IoIosArrowDown size={13} className='text-primary2' />
                  </div>
                  <ul className='w-48 bg-white hidden group-hover:block absolute top-10 left-0  rounded-b-md z-20 shadow-md px-5 py-4 transform transition duration-300 nav-item'>
                     <Link to={path.PURCHARSE_FORM} className='block py-2 hover:text-green'>Đơn mua</Link>
                     <button onClick={goLogout} className='block py-2 hover:text-green'>Đăng xuất</button>
                  </ul>
                  <div className=" z-10 h-7 w-52 absolute top-full left-0"></div>
               </div>
            }
            <div className='border-1 border-gray-300 rounded-md p-2 hover:bg-bg-green text-666 hover:text-white'>
               <IoSearchSharp size={18} />
            </div>
         </div>
      </div>
   )
}

export default Header