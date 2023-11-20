import { TooltipComponent } from '@syncfusion/ej2-react-popups'
import { useStateContext } from '../../contexts/ContextProvider';
import { FiSettings } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import ThemeSettings from '../../components/ThemeSettings';
import SideBar from '../../components/SideBar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {

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