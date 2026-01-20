import { Route, Routes } from 'react-router-dom';
import { createContext, useState } from 'react';
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

export const ItemsContext = createContext();

function App() {
  const login = { userName: 'afghan', password: '123' };
  
 
  const [isAuth, setIsAuth] = useState(false);

  return (
    <ItemsContext.Provider value={{ login, isAuth, setIsAuth }}>
       
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
        <Route path='/admin' element={  <ProtectedRoute isAuth={isAuth}> <AdminDashboard /> </ProtectedRoute>} />
        <Route path='/history' element={  <ProtectedRoute isAuth={isAuth}> <OrderHistory /> </ProtectedRoute>} />
        </Routes>
    </ItemsContext.Provider>
  );
}

export default App;
