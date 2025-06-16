import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api";
import { useAuthStatus } from "../hooks/useAuth";

export default function NavBar() {
  const { user, checking } = useAuthStatus();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  if (checking) return null;

  return (
    <nav className="navbar">
      {user ? (
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
          <div style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <span style={{ color: "white", fontWeight: 500 }}>
              {user.name ?? user.email} ({user.role})
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              <span className="nf nf-logout" /> Cerrar sesión
            </button>
          </div>
        </>
      ) : (
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
