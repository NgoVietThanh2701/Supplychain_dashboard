import React from 'react'
import { HashLoader } from 'react-spinners'
import { useStateContext } from '../contexts/ContextProvider';

const Loading = () => {

   const { currentColor } = useStateContext();

   return (
      <div className='bg-[rgba(0,0,0,0.2)] w-screen fixed nav-item top-0 bottom-0 right-0 left-0'>
         <div className='flex items-center justify-center h-screen'>
            <HashLoader color={currentColor} size={50} />
         </div>
      </div>
   )
}

export default Loading