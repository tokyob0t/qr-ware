import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Products from '../pages/Products'
import ScanQR from '../pages/ScanQR'
import Movements from '../pages/Movements'
import Reports from '../pages/Reports'
import Navbar from '../components/NavBar'

// Layout para páginas con barra de navegación
const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas con barra de navegación */}
        <Route element={<MainLayout />}>
          <Route path="/products" element={<Products />} />
          <Route path="/scan" element={<ScanQR />} />
          <Route path="/movements" element={<Movements />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter