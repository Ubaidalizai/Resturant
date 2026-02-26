import { Route, Routes, Navigate } from 'react-router-dom';
import { createContext, useState, useEffect } from 'react';
import './App.css';
import BrekFast from './Components/BrekFast';
import LunchAndDinner from './Components/LunchAndDinner';
import Drinks from './Components/Drinks';
import MenusPage from './Pages/MenusPage';
import ProtectedRoute from './Admin/ProtectedRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderHistory from './Admin/OrderHistory';
import AdminDashboard from './Admin/AdminDashbord';
import GarsonLogin from './Pages/GarsonsLogin';
import KitchenPanel from './Kitchen/KitchenPanel';
import axios from 'axios';
import { baseURL } from './configs/baseURL.config';

export const ItemsContext = createContext();

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true); // to wait for verify check

  // Check if user is already logged in
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/v1/user/verify`, {
          withCredentials: true, // send cookies
        });

        if (res.data.success) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
        console.error("Verification failed:", err);
      } finally {
        setLoadingAuth(false);
      }
    };

    verifyUser();
  }, []);

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authentication..</p>
      </div>
    );
  }

  return (
    <ItemsContext.Provider value={{ isAuth, setIsAuth }}>
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
        <Route path='/' element={<GarsonLogin />} />

      
        <Route path='/breakfast' element={<BrekFast />} />
        <Route path='/lunch' element={<LunchAndDinner />} />
        <Route path='/drinks' element={<Drinks />} />
        
        <Route path='/menus' element={isAuth ? <MenusPage /> : <Navigate to='/' />} />
        <Route path='/kitchen' element={isAuth ? <KitchenPanel /> : <Navigate to='/' />} />

        <Route
          path='/admin'
          element={isAuth ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path='/history'
          element={isAuth ? <OrderHistory /> : <Navigate to="/" />}
        />
      </Routes>
    </ItemsContext.Provider>
  );
}

export default App;