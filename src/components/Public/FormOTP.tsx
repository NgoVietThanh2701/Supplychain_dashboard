import React, { useState, useEffect } from 'react';
import { apiVerifyOTP } from '../../services/authServices';
import HashLoader from 'react-spinners/HashLoader';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import roles from '../../utils/data/roles';

interface FormOTPProps {
   role: string | any,
   email: string | any,
}

const FormOTP: React.FC<FormOTPProps> = ({ role, email }) => {

   const [otp, setOtp] = useState(['', '', '', '', '', '']);
   const otpInputs = Array(6).fill(0);
   const inputRefs: any = otpInputs.map((_) => React.createRef());
   const navigate = useNavigate();

   const handleInput = (e: any, index: number) => {
      const value = e.target.value;
      if (isNaN(value)) {
         return;
      }
      // Cập nhật giá trị trong mã OTP
      otp[index] = value;
      setOtp([...otp]);
      // Tự động nhảy sang ô kế tiếp
      if (value !== '' && index < otp.length - 1) {
         inputRefs[index + 1].current.focus();
      }
   };

   useEffect(() => {
      // Xử lý dán từ clipboard
      const handlePaste = (e: any) => {
         const clipboardData = e.clipboardData;
         const pastedData = clipboardData.getData('Text');
         const otpArray = pastedData
            .split('')
            .filter((char: any) => !isNaN(char) && char !== ' ')
            .slice(0, 6);
         // Cập nhật giá trị vào các ô OTP
         otpArray.forEach((char: any, index: number) => {
            otp[index] = char;
            inputRefs[index].current.value = char;
         });
         setOtp([...otp]);
      };
      window.addEventListener('paste', handlePaste);
      return () => {
         window.removeEventListener('paste', handlePaste);
      };
   }, [otp, inputRefs]);


   const handleOTP = async () => {
      try {
         const formatOTP = Number.parseInt(otp.join(''));
         const response = await apiVerifyOTP({ email, role, otp: formatOTP });
         Swal.fire({
            title: "Đăng ký thành công!",
            text: response.data.message,
            icon: "success"
         });
         if (role === roles[roles.customer]) {
            navigate(`/login/${roles[roles.customer]}`);
         } else {
            navigate('/');
         }
      } catch (error: any) {
         console.log(error.message)
         Swal.fire({
            title: "Đăng ký thất bại!",
            text: 'OTP không đúng!',
            icon: "error"
         });
      }
   }
   return (
      <div className="flex justify-center items-center my-[100px]">
         <div className='flex flex-col justify-center items-center gap-7'>
            <h3 className='text-lg text-green font-medium'>Nhập mã OTP tại đây</h3>
            <div className="space-x-4">
               {otpInputs.map((_, index) => (
                  <input
                     key={index}
                     type="text"
                     value={otp[index]}
                     maxLength={1}
                     onChange={(e) => handleInput(e, index)}
                     ref={inputRefs[index]}
                     className="w-11 h-12 text-center border-1 border-[#999] outline-none focus:border-[#3B71CA] rounded-md"
                  />
               ))}
            </div>
            <button onClick={handleOTP} className='bg-bg-blue py-2 px-5 mx-auto rounded-md text-white' type='button'>
               Submit
            </button>
         </div>
      </div>
   )
}

export default FormOTP