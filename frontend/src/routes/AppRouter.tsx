import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import Movements from "../pages/Movements";
import Reports from "../pages/Reports";
import ScanQR from "../pages/ScanQR";
import NavBar from "../components/NavBar";
import { useAuthStatus } from "../hooks/useAuth";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { checking, user } = useAuthStatus();
  if (checking) return <div>Cargando...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { checking, user } = useAuthStatus();
  if (checking) return <div>Cargando...</div>;
  return user ? <Navigate to="/products" /> : <>{children}</>;
}

export default function AppRouter() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <NavBar />}
      <div className="main-layout">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/movements"
            element={
              <PrivateRoute>
                <Movements />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/scanqr"
            element={
              <PrivateRoute>
                <ScanQR />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}
