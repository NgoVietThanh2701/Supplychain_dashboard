import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './containers/Dashboard/Dashboard';
import path from './utils/data/path';
import Login from './containers/Public/Login';
import Home from './containers/Public/Home';
import Register from './containers/Public/Register';
import OtpPage from './containers/Public/OtpPage';
import Shop from './containers/Public/Shop';
import SingleProduct from './containers/Public/SingleProduct';
import BuyToken from './containers/BuyToken';
import RequestUsers from './containers/Dashboard/admin/RequestUsers';
import Users from './containers/Dashboard/admin/Users';
import Harvested from './containers/Dashboard/farmer/Harvested';
import StatisticalAdmin from './containers/Dashboard/admin/StatisticalAdmin';
import StatisticalFM from './containers/Dashboard/farmer/StatisticalFM';
import Category from './containers/Dashboard/farmer/Category';
import OrderFM from './containers/Dashboard/farmer/OrderFM';
import StatisticalTPT from './containers/Dashboard/thirdParty/StatisticalTPT';
import ShopProductTPT from './containers/Dashboard/thirdParty/ShopProductTPT';
import Warehouse from './containers/Dashboard/thirdParty/Warehouse';

const App = () => {

   return (
      <Routes>
         {/* System */}
         <Route path={path.DASHBOARD} element={<Dashboard />}>
            {/* admin */}
            <Route path={path.ADMIN_STATISTICAL} element={<StatisticalAdmin />} />
            <Route path={path.ADMIN_REQUEST} element={<RequestUsers />} />
            <Route path={path.ADMIN_USERS} element={<Users />} />
            {/* - farmer */}
            <Route path={path.FARMER_STATISTICAL} element={<StatisticalFM />} />
            <Route path={path.FARMER_PRODUCT} element={<Harvested />} />
            <Route path={path.FARMER_CATEGORY} element={<Category />} />
            <Route path={path.FARMER_ORDER} element={<OrderFM />} />
            {/* third party */}
            <Route path={path.THIRDPARTY_STATISTICAL} element={<StatisticalTPT />} />
            <Route path={path.THIRDPARTY_SHOP} element={<ShopProductTPT />} />
            <Route path={path.THIRDPARTY_WAREHOUSE} element={<Warehouse />} />
         </Route>
         {/* Public */}
         <Route path={path.LOGIN} element={<Login />} />
         <Route path={path.REGISTER} element={<Register />} />
         <Route path={path.VERIFY_OTP} element={<OtpPage />} />
         {/* ---- */}
         <Route path={path.HOME} element={<Home />} />
         <Route path={path.SHOP} element={<Shop />} />
         <Route path={path.SINGLE_PRODUCT} element={<SingleProduct />} />
         <Route path={path.BUY_TOKEN} element={<BuyToken />} />
      </Routes>

   )
}

export default App