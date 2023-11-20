import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './containers/Dashboard/Dashboard';
import path from './utils/data/path';
import Login from './containers/Public/Login';
import Home from './containers/Public/Home';
import Register from './containers/Public/Register';
import OtpPage from './containers/Public/OtpPage';

const App = () => {

   return (
      <BrowserRouter>
         <Routes>
            {/* System */}
            <Route path={path.DASHBOARD} element={<Dashboard />}>
               {/* Outlook */}
            </Route>
            {/* User */}
            <Route path={path.LOGIN} element={<Login />} />
            <Route path={path.REGISTER} element={<Register />} />
            <Route path={path.VERIFY_OTP} element={<OtpPage />} />
            <Route path={path.HOME} element={<Home />} >
               {/* Outlook */}
            </Route>
         </Routes>
      </BrowserRouter>
   )
}

export default App