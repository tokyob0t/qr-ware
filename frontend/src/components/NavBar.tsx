import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const handleLogout = () => {
    console.log('Usuario cerró sesión');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img 
          src={logo} 
          alt="QRWare Logo" 
          className="navbar-logo"
        />
      </div>
      
      <div className="navbar-links">
        <NavLink 
          to="/products" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <span className="nf nf-products"></span>
          Productos
        </NavLink>
        
        <NavLink 
          to="/scan" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <span className="nf nf-scan"></span>
          Escanear QR
        </NavLink>
        
        <NavLink 
          to="/movements" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <span className="nf nf-movements"></span>
          Movimientos
        </NavLink>
        
        <NavLink 
          to="/reports" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <span className="nf nf-reports"></span>
          Reportes
        </NavLink>
      </div>
      
      <div className="navbar-user">
        <div className="user-info">
          <span className="nf nf-user"></span>
          <span>Operario</span>
        </div>
        <button 
          onClick={handleLogout} 
          className="logout-btn"
        >
          <span className="nf nf-logout"></span>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;