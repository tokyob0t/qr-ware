import { NavLink } from 'react-router-dom';

const Navbar = () => {
  // Función para cerrar sesión
  const handleLogout = () => {
    // Lógica de logout (a implementar)
    console.log('Usuario cerró sesión');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo">QRWare</span>
      </div>
      
      <div className="navbar-links">
        <NavLink 
          to="/products" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <i className="icon inventory-icon"></i>
          Productos
        </NavLink>
        
        <NavLink 
          to="/scan" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <i className="icon scan-icon"></i>
          Escanear QR
        </NavLink>
        
        <NavLink 
          to="/movements" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <i className="icon movements-icon"></i>
          Movimientos
        </NavLink>
        
        <NavLink 
          to="/reports" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <i className="icon reports-icon"></i>
          Reportes
        </NavLink>
      </div>
      
      <div className="navbar-user">
        <div className="user-info">
          <i className="icon user-icon"></i>
          <span>Operario</span>
        </div>
        <button 
          onClick={handleLogout} 
          className="logout-btn"
        >
          <i className="icon logout-icon"></i>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;