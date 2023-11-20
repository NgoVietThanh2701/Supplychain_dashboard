import React from 'react'
import FormOTP from '../../components/FormOTP';
import { useParams } from 'react-router-dom';

const OtpPage = () => {

   const { role, email } = useParams();

   return (
      <div className='flex flex-col items-center justify-center gap-7'>
         <FormOTP role={role} email={email} />
      </div>
   )
}

export default OtpPage