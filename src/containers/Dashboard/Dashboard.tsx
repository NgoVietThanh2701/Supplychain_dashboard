import { TooltipComponent } from '@syncfusion/ej2-react-popups'
import { useStateContext } from '../../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import Navbar from '../../components/Dashboard/Navbar';
import ThemeSettings from '../../components/Dashboard/ThemeSettings';
import SideBar from '../../components/Dashboard/SideBar';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { resetAuth } from '../../features/authSlice';
import { resetCurrentUser } from '../../features/userSlice';
import roles from '../../utils/data/roles';

const Dashboard = () => {

   const { isLoggedIn, expiredToken } = useSelector((state: any) => state.auth);
   const { currentUser } = useSelector((state: any) => state.user);

   const navigate = useNavigate();
   const dispatch = useDispatch();

   useEffect(() => {
      if (!isLoggedIn) {
         navigate('/')
      }
   }, [isLoggedIn, navigate]);

   useEffect(() => {
      if (currentUser === roles[roles.customer]) {
         navigate('/')
      }
   }, [currentUser, navigate])

   const goLogout = useCallback(() => {
      dispatch(resetAuth());
      dispatch(resetCurrentUser());
      navigate('/');
   }, [dispatch, navigate])

   useEffect(() => {
      if (expiredToken) {
         goLogout();
      }
   }, [expiredToken, goLogout])


   const { activeMenu, themeSettings, setThemeSettings, currentColor } = useStateContext();

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
               <Navbar />
            </div>
            {themeSettings && <ThemeSettings />}
            <div>
               {/* home */}
               <Outlet />
            </div>
         </div>
      </div>
   )
}

export default Dashboard