import React, { useEffect, useState } from 'react'
import Header from '../components/Public/Header'
import Footer from '../components/Public/Footer'
import { MdOutlineManageHistory } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";
import { PiSwapLight } from "react-icons/pi";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { FaBuyNLarge } from "react-icons/fa";
import CrowdSaleContract from '../contracts/CrowdSaleContract';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';
import Loading from '../components/Loading';
import SuccessModal from '../components/SuccessModal';

declare var window: any;
const agtImg = require('../utils/images/agt-token.png');
const bnbImg = require('../utils/images/bnb-token.png');

const BuyToken = () => {

   const [bnbToken, setTokenBNB] = useState(0);
   const [rate, setRate] = useState(0);
   const [web3Provider, setWeb3Provider] = useState<any>();
   const [address, setAddress] = useState('');
   const [txHash, setTxHash] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const getRate = async () => {
      const crowdContract = new CrowdSaleContract();
      const _rate = await crowdContract.getBnbRate();
      console.log(_rate)
      setRate(_rate);
   }

   useEffect(() => {
      getRate();
   }, [getRate]);

   const onConnectMetamask = async () => {
      if (window.ethereum) {
         try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
            const accounts = await provider.send("eth_requestAccounts", []);
            if (accounts.length > 0) {
               const signer = provider.getSigner();
               const address = await signer.getAddress();
               setWeb3Provider(provider);
               setAddress(address)
            } else {
               Swal.fire('Opps', 'Không tài khoản nào được chọn', 'error');
            }
         } catch (error) {
            console.log(error);
         }
      }
   }

   const handleBuyToken = async () => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true)
         const crowdContract = new CrowdSaleContract(web3Provider);
         let hash = await crowdContract.buyTokenByBnB(bnbToken);
         setTxHash(hash);
         setTokenBNB(0)
         setIsLoading(false);
         setIsOpenModal(true);
      } catch (error) {
         setIsLoading(false)
         setTokenBNB(0);
         Swal.fire('Opps', 'Giao dịch thất bại', 'error');
      }
   }

   return (
      <div className='font-rubik w-full flex flex-col items-center'>
         {isLoading && <Loading />}
         {isOpenModal && <SuccessModal setIsOpenModal={setIsOpenModal} txHash={txHash} title='Mua token AGT' />}
         <Header />
         <div className='flex items-center justify-between w-5/6 px-5 mt-8'>
            {(address && web3Provider) ?
               <p className='text-green'>Kết nối ví thành công! <span className='text-333'>{address}</span></p> :
               <button className='text-red-500 text-lg'
                  onClick={onConnectMetamask}>Vui lòng kết nối ví</button>
            }
            <div className='flex items-center gap-6'>
               <span className='inline-flex gap-2 items-center text-333'><MdOutlineManageHistory /> Lịch sử</span>
               <span className='inline-flex gap-2 items-center text-333'><BsQuestionCircle /> Câu hỏi thường gặp</span>
            </div>
         </div>
         <div className='flex justify-between gap-20 p-10'>
            <div className='flex flex-col gap-3'>
               <h3 className='text-333 text-4xl font-medium'>Mua tiền điện tử</h3>
               <p className='text-666'>Nhiều phương thức thanh toán khác nhau</p>
               <div className='flex items-center justify-between mt-8'>
                  <span className='text-333'>
                     <MdOutlineVerifiedUser size={36} color='#555' className='mx-auto mb-2' />
                     Đăng nhập
                  </span>
                  <span className='text-333'>
                     <PiSwapLight size={36} color='#444' className='mx-auto  mb-2' />
                     Nhập số token
                  </span>
                  <span className='text-333'>
                     <FaBuyNLarge size={36} color='#444' className='mx-auto  mb-2' />
                     Mua token
                  </span>
               </div>
            </div>
            <div className='w-[360px]'>
               <div className='flex flex-col gap-3 bg-[#FAFAFA] rounded-lg py-3 px-5'>
                  <label htmlFor="spen" className='text-333 text-xl'>Chi</label>
                  <div className='flex'>
                     <input type="number" onChange={(e: any) => setTokenBNB(e.target.value)} id='spen' className='outline-none w-full bg-[#FAFAFA]' />
                     <div className='bg-white rounded-3xl flex pr-7 pl-2 py-1 items-center gap-2'>
                        <img src={bnbImg} alt="" className='w-7 h-7 object-cover' />
                        <span className='text-green'>BNB</span>
                     </div>
                  </div>
               </div>
               <div className='flex flex-col gap-3 bg-[#FAFAFA] rounded-lg py-3 px-5'>
                  <label htmlFor="recei" className='text-333 text-xl'>Nhận</label>
                  <div className='flex'>
                     <input type="number" value={bnbToken * rate} readOnly id='recei' className='outline-none w-full bg-[#FAFAFA]' />
                     <div className='bg-white rounded-3xl flex pl-2 py-1 pr-7 items-center gap-2'>
                        <img src={agtImg} alt="" className='w-7 h-7  object-cover' />
                        <span className='text-green'>AGT</span>
                     </div>
                  </div>
               </div>
               <button onClick={handleBuyToken} disabled={bnbToken ? false : true} className={`px-5 py-2 bg-bg-green text-white rounded-lg mt-5 ${!bnbToken && 'cursor-not-allowed opacity-60'}`}>Xác nhận</button>
            </div>
         </div>
         <div className='w-full border-t-1 border-color mt-[100px]' />
         <Footer />
      </div>
   )
}

export default BuyToken