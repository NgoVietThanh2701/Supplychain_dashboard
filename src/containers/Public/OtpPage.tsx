import React from 'react'
import FormOTP from '../../components/Public/FormOTP';
import { useParams } from 'react-router-dom';
import Header from '../../components/Public/Header';
import Footer from '../../components/Public/Footer';

const OtpPage = () => {

   const { role, email } = useParams();

   return (
      <div className='flex flex-col items-center justify-center gap-7'>
         <Header />
         <FormOTP role={role} email={email} />
         <div className='w-full border-t-1 border-color' />
         <Footer />
      </div>
   )
}

export default OtpPage