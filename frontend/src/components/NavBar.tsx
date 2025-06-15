import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api"; // importa la función logout

export default function NavBar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); 
    } catch (e) {
    } finally {
      localStorage.removeItem("token"); 
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      {token && (
        <>
          <div className="navbar-links">
            <NavLink to="/products" className="nav-link">
              <span className="nf nf-products" /> Productos
            </NavLink>
            <NavLink to="/movements" className="nav-link">
              <span className="nf nf-movements" /> Movimientos
            </NavLink>
            <NavLink to="/reports" className="nav-link">
              <span className="nf nf-reports" /> Reportes
            </NavLink>
            <NavLink to="/scanqr" className="nav-link">
              <span className="nf nf-scan" /> Escanear QR
            </NavLink>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nf nf-logout" /> Cerrar sesión
          </button>
        </>
      )}
      {!token && (
        <div className="navbar-links">
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
          <NavLink to="/register" className="nav-link">
            Registro
          </NavLink>
        </div>
      )}
    </nav>
  );
}
