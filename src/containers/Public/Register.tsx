import React, { useState, useEffect } from 'react';
import InputForm from "../../components/Public/InputForm";
import { Link, useParams } from 'react-router-dom';
import roles from '../../utils/data/roles';
import validate from '../../utils/function/validateField';
import { apiRegister } from '../../services/authServices';
import { ethers } from 'ethers'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../../components/Public/Header';
import Footer from '../../components/Public/Footer';
import SupplyChainContract from '../../contracts/SupplyChainContract';
import { LiaGripfire } from 'react-icons/lia';

declare var window: any;
const loginImg = require('../../utils/images/login.jpg');

const Register = () => {

   const navigate = useNavigate();
   const [web3Provider, setWeb3Provider] = useState<any>();

   interface InvalidField {
      name: string,
      message: string,
   }

   const { role } = useParams();

   const [invalidFields, setInvalidFields] = useState<InvalidField[]>([]);
   const [payload, setPayload] = useState({
      name: '',
      email: '',
      password: '',
      description: '',
      role: '',
      addressWallet: '',
   });
   useEffect(() => {
      setPayload((prev: any) => ({ ...prev, role: role }));
   }, []);

   const handleSubmit = async () => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      let invalids = validate(payload, setInvalidFields);
      if (invalids === 0) {
         try {
            const supplychainContract = new SupplyChainContract(web3Provider);
            if (role === roles[roles.customer]) {
               await supplychainContract.addCustomer(payload.addressWallet);
            }
            const response = await apiRegister(payload);
            Swal.fire({
               title: "Đăng ký thành công!",
               text: response.data.message,
               icon: "success"
            });
            navigate(`./${payload.email}/verify-otp`);
         } catch (error: any) {
            Swal.fire({
               title: "Đăng ký thất bại!",
               text: 'Tài khoản đã tồn tại hay thông tin không đúng',
               icon: "error"
            });
         }
      }
   }

   const connectWallet = async () => {
      if (window.ethereum) {
         const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
         await provider.send("eth_requestAccounts", []);
         const signer = provider.getSigner();
         const address = await signer.getAddress();
         setPayload((prev: any) => ({ ...prev, addressWallet: address }));
         setWeb3Provider(provider);
      }
   }

   return (
      <div className='font-rubik w-full flex flex-col items-center justify-center bg-main-bg'>
         <div className='w-5/6 h-[80px] flex justify-between items-center'>
            <Link to='/' className=' flex items-center'>
               <LiaGripfire size={38} className='text-green' />
               <span className='text-green text-xl font-bold'>AGRICHAIN</span>
            </Link>
            <span className='text-green'>
               Bạn cần giúp đỡ?
            </span>
         </div>
         <div className='bg-white w-[900px] mt-12 mb-40 p-[30px] rounded-md border-color border-1'>
            <h3 className='ml-32 font-semibold text-primary2 text-4xl mb-3'>Đăng ký</h3>
            <div className='flex mx-5'>
               <div className='flex-1'>
                  <img src={loginImg} alt="" />
               </div>
               <div className='flex-1 flex flex-col gap-4 '>
                  <InputForm
                     setInvalidFields={setInvalidFields}
                     invalidFields={invalidFields}
                     label='Nhập tên'
                     value={payload.name}
                     setValue={setPayload}
                     keyPayload='name'
                  />
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
                  {role === roles[roles.thirdparty] &&
                     <InputForm
                        setInvalidFields={setInvalidFields}
                        invalidFields={invalidFields}
                        label='Nhập mô tả'
                        value={payload.description}
                        setValue={setPayload}
                        keyPayload='description'
                     />}
                  {payload.addressWallet === '' ?
                     <button onClick={connectWallet} className='flex py-[4px] px-2 w-32 rounded-sm items-center justify-around border-1 border-color'>
                        <span className='text-md text-primary2 font-medium'>Thêm ví</span>
                        <img src="https://docs.material-tailwind.com/icons/metamask.svg" alt="metamask" className="h-6 w-6" />
                     </button> :
                     <span className='text-md text-primary2 font-medium'>{payload.addressWallet}</span>}
                  {<small className='text-red-700 italic'>
                     {invalidFields.find((i: any) => i.name === 'addressWallet')?.message}
                  </small>}
                  <span className='text-[13px] text-primary2 text-right'>
                     Bạn đã có tài khoản? <span>Đăng nhập</span>
                  </span>
                  <button type='button' onClick={handleSubmit} className='text-white bg-bg-blue mx-auto text-base px-6 py-2 rounded-[6px]'>
                     Đăng ký
                  </button>
               </div>
            </div>
         </div>
         <div className='w-full border-t-1 border-color' />
         <Footer />
      </div>
   )
}

export default Register