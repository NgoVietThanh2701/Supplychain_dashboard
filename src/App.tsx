import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './containers/Dashboard/Dashboard';
import path from './utils/data/path';
import Login from './containers/Public/Login';
import Home from './containers/Public/Home';
import Register from './containers/Public/Register';
import OtpPage from './containers/Public/OtpPage';
import Shop from './containers/Public/Shop';
import SingleProduct from './containers/Public/SingleProduct';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getCurrentUser } from './features/userSlice';

const App = () => {

   const { isLoggedIn } = useSelector((state: any) => state.auth);
   const dispatch = useDispatch<any>();

   useEffect(() => {
      if (isLoggedIn) {
         setTimeout(() => {
            dispatch(getCurrentUser());
         }, 500)
      }
   }, [dispatch, isLoggedIn])

   return (
      <Routes>
         {/* System */}
         <Route path={path.DASHBOARD} element={<Dashboard />}>
            {/* Outlet */}
         </Route>
         {/* User */}
         <Route path={path.LOGIN} element={<Login />} />
         <Route path={path.REGISTER} element={<Register />} />
         <Route path={path.VERIFY_OTP} element={<OtpPage />} />
         {/* ---- */}
         <Route path={path.HOME} element={<Home />} />
         <Route path={path.SHOP} element={<Shop />} />
         <Route path={path.SINGLE_PRODUCT} element={<SingleProduct />} />
      </Routes>

   )
}

export default App