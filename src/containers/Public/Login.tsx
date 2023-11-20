import React, { useState } from 'react';
import InputForm from '../../components/InputForm';
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { RiGoogleFill } from "react-icons/ri";
import { useParams } from 'react-router-dom';
import validate from '../../utils/function/validateField';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../features/authSlice';
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

const loginImg = require('../../utils/images/login.jpg');

const Login = () => {

   const { role } = useParams();
   const dispatch = useDispatch<any>();

   const [invalidFields, setInvalidFields] = useState([])
   const [payload, setPayload] = useState({
      email: '',
      password: '',
      role: role
   });
   setPayload((prev: any) => ({ ...prev, role: role }));

   const handleSubmit = async () => {
      let invalids = validate(payload, setInvalidFields);
      if (invalids === 0) {
         dispatch(loginThunk(payload));
      }
   }

   return (
      <div className='w-full flex flex-col items-center justify-center bg-main-bg'>
         <div className='bg-white w-[900px] mt-16 mb-40 p-[30px] rounded-md border-color border-1'>
            <h3 className='ml-32 font-semibold text-primary2 text-4xl mb-3'>Đăng nhập</h3>
            <div className='flex mx-5'>
               <div className='flex-1'>
                  <img src={loginImg} alt="" />
               </div>
               <div className='flex-1 flex flex-col gap-6 '>
                  <div className='flex justify-center gap-3'>
                     <span className='text-primary font-medium text-base'>Đăng nhập với</span>
                     <div className='flex gap-2'>
                        <FaFacebookF color='white' className='bg-bg-blue cursor-pointer rounded-full p-1.5' size={26} />
                        <FaTwitter color='white' className='bg-bg-blue cursor-pointer rounded-full p-1.5' size={26} />
                        <RiGoogleFill color='white' className='bg-bg-blue cursor-pointer rounded-full p-1.5' size={26} />
                     </div>
                  </div>
                  <div className='border relative mb-1'>
                     <div className='z-10 w-10 bg-white text-center absolute top-[-14px] right-[50%] text-primary font-semibold text-base'>Or</div>
                  </div>
                  <InputForm
                     setInvalidFields={setInvalidFields}
                     invalidFields={invalidFields}
                     label='Nhập Email'
                     value={payload.email}
                     setValue={setPayload}
                     keyPayload='email'
                  />
                  <InputForm
                     setInvalidFields={setInvalidFields}
                     invalidFields={invalidFields}
                     label='Nhập mật khẩu'
                     value={payload.password}
                     setValue={setPayload}
                     keyPayload='password'
                     type='password'
                  />
                  <span className='text-sm text-primary2 text-right'>
                     Forgot password?
                  </span>
                  <button onClick={handleSubmit} className='text-white bg-bg-blue mx-auto text-base px-6 py-2 rounded-[6px]'>
                     Đăng nhập
                  </button>
               </div>
            </div>
         </div>
      </div>

   )
}

export default Login;