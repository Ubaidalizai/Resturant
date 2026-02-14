import { Route, Routes } from 'react-router-dom';
import { createContext, useState, useEffect } from 'react';
import './App.css';
import Willcome from './Pages/Willcome';
import BrekFast from './Components/BrekFast';
import LunchAndDinner from './Components/LunchAndDinner';
import Drinks from './Components/Drinks';
import MenusPage from './Pages/MenusPage';
import SignUp from './Pages/SignUp';
import ProtectedRoute from'./Admin/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderHistory from './Admin/OrderHistory';
import AdminDashboard from './Admin/AdminDashbord';
import GarsonLogin from './Pages/GarsonsLogin'
import KitchenPanel from './Kitchen/KitchenPanel';

export const ItemsContext = createContext();
function App() {

  const [isAuth, setIsAuth] = useState(false);
 
  return (
    <ItemsContext.Provider value={{isAuth, setIsAuth }}>
       
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path='/' element={<Willcome />} />
        <Route path='/menus' element={<MenusPage />} />
        <Route path='/breakfast' element={<BrekFast />} />
        <Route path='/lunch' element={<LunchAndDinner />} />
        <Route path='/drinks' element={<Drinks />} />
        <Route path='/login' element={<SignUp />} />
        <Route path='/kitchen' element={< KitchenPanel />} />
        <Route path='/garson-login' element={<GarsonLogin />} />
        <Route path='/admin' element={  <ProtectedRoute isAuth={isAuth}> <AdminDashboard /> </ProtectedRoute>} />
        <Route path='/history' element={  <ProtectedRoute isAuth={isAuth}> <OrderHistory /> </ProtectedRoute>} />
        </Routes>
    </ItemsContext.Provider>
  );
}

export default App;
