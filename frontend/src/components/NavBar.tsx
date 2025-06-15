import { NavLink, useNavigate } from "react-router-dom";

export default function NavBar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {token ? (
          <>
            <NavLink
              to="/products"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <span className="nf nf-products" /> Productos
            </NavLink>
            <NavLink
              to="/movements"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <span className="nf nf-movements" /> Movimientos
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <span className="nf nf-reports" /> Reportes
            </NavLink>
            <NavLink
              to="/scanqr"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <span className="nf nf-scan" /> Escanear QR
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <span className="nf nf-user" /> Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <span className="nf nf-user" /> Registro
            </NavLink>
          </>
        )}
      </div>
      {token && (
        <div className="navbar-user">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            <span className="nf nf-logout" /> Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
