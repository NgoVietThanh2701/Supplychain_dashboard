import React, { useEffect, ReactNode } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../../contexts/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { refreshTokenThunk } from '../../features/authSlice';
import { getCurrentUser } from '../../features/userSlice';

const avatar = require("../../utils/images/avatar.png");

interface NavButtonProps {
   title: string,
   customFunc: () => void,
   icon: ReactNode,
   color: string,
   dotColor?: string
}

const NavButton: React.FC<NavButtonProps> = ({ title, customFunc, icon, color, dotColor }) => (
   <TooltipComponent content={title} position='BottomCenter'>
      <button type='button' onClick={customFunc} style={{ color }} className='relative text-xl rounded-full p-3 hover:bg-light-gray'>
         <span style={{ background: dotColor }} className='absolute inline-flex rounded-full h-2 w-2 right-2 top-2' />
         {icon}
      </button>
   </TooltipComponent>
)

const Navbar = () => {

   const { activeMenu, setActiveMenu, screenSize, setScreenSize, currentColor } = useStateContext();

   const { currentUser } = useSelector((state: any) => state.user);

   // get size screen width when open website
   useEffect(() => {
      const handleResize = () => setScreenSize(window.innerWidth);
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize)
   }, [setScreenSize]);

   // handle is open or not with sidebar
   useEffect(() => {
      if (screenSize! <= 900) {
         setActiveMenu(false);
      } else {
         setActiveMenu(true);
      }
   }, [screenSize, setActiveMenu]);

   // ------------------
   const dispatch = useDispatch<any>();
   const { isLoggedIn, token, refreshToken } = useSelector((state: any) => state.auth);

   // compare expired live of token and dispatch get new token access
   console.log('token', token);
   console.log('refresh token', refreshToken);
   if (token && token !== null) { // no token. require user login
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decodedToken.exp * 1000; // Đổi từ giây sang mili-giây
      const currentTime = Date.now();
      if (currentTime >= expirationTime) {
         console.log('dispatch token refresh!')
         dispatch(refreshTokenThunk(refreshToken));
      }

   }

   useEffect(() => {
      setTimeout(() => {
         isLoggedIn && dispatch(getCurrentUser());
      }, 700)
   }, [isLoggedIn, dispatch]);

   return (
      <div className='flex justify-between px-2 py-1.5 md:mx-4 relative'>
         <NavButton title='Menu' customFunc={() => setActiveMenu(!activeMenu)} color={currentColor} icon={<AiOutlineMenu />} />
         <div className='flex'>
            <NavButton title='Cart' customFunc={() => { }} color={currentColor} icon={<FiShoppingCart />} />
            <NavButton title='Chat' dotColor='#03C9D7' customFunc={() => { }} color={currentColor} icon={<BsChatLeft />} />
            <NavButton title='Notification' customFunc={() => { }} color={currentColor} icon={<RiNotification3Line />} />
            <TooltipComponent content='Profile' position='BottomCenter'>
               <div className='flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg' onClick={() => { }}>
                  <img className='rounded-full w-8 h-8' src={avatar} alt="" />
                  <p>
                     <span className='text-gray-400 text-14'>Hi, </span> {''}
                     <span className='text-gray-400 font-bold ml-1 text-14'>{currentUser?.name}</span>
                  </p>
                  <MdKeyboardArrowDown className='text-gray-400 text-14' />
               </div>
            </TooltipComponent>
         </div>
      </div>
   )
}

export default Navbar