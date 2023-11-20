import React, { useEffect, ReactNode } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../contexts/ContextProvider';

const avatar = require("../utils/images/avatar.png");

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

   // get size screen width when open website
   useEffect(() => {
      const handleResize = () => setScreenSize(window.innerWidth);
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize)
   }, []);

   // handle is open or not with sidebar
   useEffect(() => {
      if (screenSize! <= 900) {
         setActiveMenu(false);
      } else {
         setActiveMenu(true);
      }
   }, [screenSize]);

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
                     <span className='text-gray-400 font-bold ml-1 text-14'>NgoVietThanh</span>
                  </p>
                  <MdKeyboardArrowDown className='text-gray-400 text-14' />
               </div>
            </TooltipComponent>
         </div>
      </div>
   )
}

export default Navbar