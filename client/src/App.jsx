import { Route, Routes, Navigate } from 'react-router-dom';
import { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import BrekFast from './Components/BrekFast';
import LunchAndDinner from './Pages/LunchAndDinner';
import Drinks from './Pages/Drinks';
import ProtectedRoute from './Admin/ProtectedRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderHistory from './Admin/OrderHistory';
import AdminDashboard from './Admin/AdminDashbord';
import GarsonLogin from './Pages/GarsonsLogin';
import KitchenPanel from './Kitchen/KitchenPanel';
import { useApi } from './context/ApiContext';
import GarsoonDashboard from './Pages/GarsoonDashboard';
import ForggotPasswordPage from './Pages/ForggotPasswordPage';
import ResetPasswordPage from './Pages/ResetPasswordPage';
import LanguageSwitcher from './Components/UI/LanguageSwitcher';

export const ItemsContext = createContext();

function App() {
  const { get } = useApi();
  const { t } = useTranslation("common");
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // to wait for verify check

  // Check if user is already logged in
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await get('/api/v1/user/verify', {
          withCredentials: true, // send cookies
        });

        if (res.data.success) {
          setIsAuth(true);
          setUser(res.data?.data?.user)
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
        <p>{t("CheckingAuthentication")}</p>
      </div>
    );
  }

  return (
    <ItemsContext.Provider value={{ isAuth, setIsAuth, user, setUser }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <LanguageSwitcher />

      <Routes>
        <Route path='/' element={<GarsonLogin />} />

      
        <Route path='/breakfast' element={<BrekFast />} />
        <Route path='/lunch' element={<LunchAndDinner />} />
        <Route path='/drinks' element={<Drinks />} />
        
        <Route path='/menus' element={isAuth ? <GarsoonDashboard /> : <Navigate to='/' />} />
        <Route path="/forgot-password" element={<ForggotPasswordPage />} />
        
        <Route path='/kitchen' element={isAuth ? <KitchenPanel /> : <Navigate to='/' />} />

        <Route
          path='/admin'
          element={isAuth ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path='/history'
          element={isAuth ? <OrderHistory /> : <Navigate to="/" />}
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </ItemsContext.Provider>
  );
}

export default App;