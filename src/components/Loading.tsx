import React from 'react'
import { HashLoader } from 'react-spinners'

const Loading = () => {
   return (
      <div className='bg-[rgba(0,0,0,0.2)] w-screen fixed nav-item top-0 bottom-0 right-0 left-0'>
         <div className='flex items-center justify-center h-screen'>
            <HashLoader color="#209E2E" size={50} />
         </div>
      </div>
   )
}

export default Loading