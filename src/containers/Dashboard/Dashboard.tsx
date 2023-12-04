import { TooltipComponent } from '@syncfusion/ej2-react-popups'
import { useStateContext } from '../../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import Navbar from '../../components/Dashboard/Navbar';
import ThemeSettings from '../../components/Dashboard/ThemeSettings';
import SideBar from '../../components/Dashboard/SideBar';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react';
import { getCurrentUser, resetCurrentUser } from '../../features/userSlice';
import roles from '../../utils/data/roles';
import { resetAuth } from '../../features/authSlice';
import checkTokenExpired from '../../utils/function/checkTokenExpired';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';

declare var window: any;

const Dashboard = () => {

   const { isLoggedIn, token } = useSelector((state: any) => state.auth);
   const { currentUser } = useSelector((state: any) => state.user);
   const { activeMenu, themeSettings, setThemeSettings, currentColor } = useStateContext();

   const navigate = useNavigate();
   const dispatch = useDispatch<any>();

   const [web3Provider, setWeb3Provider] = useState<any>();
   const [address, setAddress] = useState('');

   // when user no login and login with role customer => navigate web user
   useEffect(() => {
      if (!isLoggedIn || currentUser?.role === roles[roles.customer]) {
         navigate('/')
      }
   }, [isLoggedIn, navigate, currentUser]);

   const goLogout = useCallback(() => {
      dispatch(resetAuth());
      dispatch(resetCurrentUser());
      localStorage.removeItem('supplychain_address');
      navigate('/');
   }, [dispatch, navigate]);

   useEffect(() => {
      if (token) {
         checkTokenExpired(token) && goLogout();
      }
   }, [token]);

   const onConnectMetamask = async () => {
      if (window.ethereum) {
         try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
            const accounts = await provider.send("eth_requestAccounts", []);
            if (accounts.length > 0) {
               const signer = provider.getSigner();
               const address = await signer.getAddress();
               if (address === currentUser?.addressWallet) {
                  // Lưu thông tin vào localStorage
                  localStorage.setItem("supplychain_address", address);
                  setWeb3Provider(provider);
                  setAddress(address)
               } else {
                  Swal.fire('Opps', 'Vui lòng kết nối với tài khoản đã đăng ký trước đó', 'error');
                  setAddress('');
                  setWeb3Provider(null);
                  localStorage.removeItem('supplychain_address');
               }
            } else {
               Swal.fire('Opps', 'Không tài khoản nào được chọn', 'error');
            }
         } catch (error) {
            console.log(error);
         }
      }
   }

   // get address from localStorage.
   useEffect(() => {
      const storedAddress = localStorage.getItem("supplychain_address");
      if (storedAddress) {
         setAddress(storedAddress);
         const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
         setWeb3Provider(provider);
      }
   }, []);

   useEffect(() => {
      if (isLoggedIn) {
         setTimeout(() => {
            dispatch(getCurrentUser());
         }, 500)
      }
   }, [dispatch, isLoggedIn])

   return (
      <div className='flex relative'>
         <div className='fixed right-4 bottom-4' style={{ zIndex: '1000' }}>
            {/*Settings*/}
            <TooltipComponent content='Settings' position='TopCenter'>
               <button type='button' className='text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white rounded-full' style={{ background: currentColor }}
                  onClick={() => setThemeSettings(true)}>
                  <FiSettings />
               </button>
            </TooltipComponent>
         </div>
         {/* Sidebar*/}
         {activeMenu ?
            <div className='w-72 fixed sidebar bg-white' >
               <SideBar />
            </div> :
            <div className='w-0'>
               <SideBar />
            </div>}

         <div className={`bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}>
            <div className='fixed md:static bg-main-bg navbar w-full'>
               <Navbar address={address} onConnectMetamask={onConnectMetamask} />
            </div>
            {themeSettings && <ThemeSettings />}
            <div>
               {/* home */}
               <Outlet context={web3Provider} />
            </div>
         </div>
      </div>
   )
}

export default Dashboard