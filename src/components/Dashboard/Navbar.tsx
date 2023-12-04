import React, { useEffect, ReactNode, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../../contexts/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { showShortAddress } from '../../utils/function/format';
import CrowdSaleContract from '../../contracts/CrowdSaleContract';
import Swal from 'sweetalert2';
import { ethers } from 'ethers';

const avatar = require("../../utils/images/avatar.png");
declare var window: any;

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

const Navbar = ({ address, onConnectMetamask }: any) => {

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


   return (
      <div className='flex justify-between px-2 pt-2 md:mx-4 relative shadow-sm'>
         <div className='flex items-center'>
            <NavButton title='Menu' customFunc={() => setActiveMenu(!activeMenu)} color={currentColor} icon={<AiOutlineMenu />} />
            {address ? <p className='text-green'>Kết nối ví thành công !</p> :
               <button className='text-[#C82032]'
                  onClick={onConnectMetamask}>Vui lòng kết nối ví</button>
            }
         </div>
         <div className='flex'>
            <NavButton title='Cart' customFunc={() => { }} color={currentColor} icon={<FiShoppingCart />} />
            <NavButton title='Chat' dotColor='#03C9D7' customFunc={() => { }} color={currentColor} icon={<BsChatLeft />} />
            <NavButton title='Notification' customFunc={() => { }} color={currentColor} icon={<RiNotification3Line />} />
            <TooltipComponent content='Profile' position='BottomCenter'>
               <div className='flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg' onClick={() => { }}>
                  <img className='rounded-full w-8 h-8' src={avatar} alt="" />
                  <p>
                     <span className='text-gray-666 text-14'>Hi, </span> {''}
                     <span className='text-gray-500 font-semibold ml-1 text-14'>{currentUser?.name}</span>
                     <span className='text-333 text-base'> ({showShortAddress(currentUser?.addressWallet, 4)}) </span>
                  </p>
                  <MdKeyboardArrowDown className='text-gray-400 text-14' />
               </div>
            </TooltipComponent>
         </div>
      </div>
   )
}

export default Navbar