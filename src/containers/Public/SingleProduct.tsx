import React from 'react'
import { useParams } from 'react-router-dom'
import BackgroundShop from '../../components/Public/BackgroundShop';
import Footer from '../../components/Public/Footer';
import DesProduct from '../../components/Public/DesProduct';

const SingleProduct = () => {

   const { code } = useParams();

   return (
      <div className='font-rubik w-full flex flex-col items-center'>
         <BackgroundShop />
         <DesProduct />
         <div className='w-full border-t-1 border-color mt-10' />
         <Footer />
      </div>
   )
}

export default SingleProduct